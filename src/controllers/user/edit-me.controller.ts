import { Put, UsePipes, Body, Controller, UseGuards } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { CurrentUser } from "../../auth/current-user-decorator";
import { UserPayload } from "../../auth/jwt.strategy";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { CloudflareR2Service } from "../../services/r2-upload.service";

const editAccountSchema = z.object({
  password: z.string(),
  username: z.string(),
  email: z.string().email(),
  foto: z.string().nullable(),
  bio: z.string().nullable(),
});

type EditAccountSchema = z.infer<typeof editAccountSchema>;

@Controller("/me")
@UseGuards(JwtAuthGuard)
export class EditMeController {
  constructor(
    private prisma: PrismaService,
    private r2: CloudflareR2Service,
  ) {}

  @Put()
  @UsePipes(new ZodValidationPipe(editAccountSchema))
  async handle(
    @Body() body: EditAccountSchema,
    @CurrentUser() userPayload: UserPayload,
  ) {
    const { sub: id } = userPayload;
    const { email, password, username, foto, bio } = body;

    let fotoURL: string | null = null;

    if (foto !== null && foto.startsWith("https") === false) {
      fotoURL = await this.r2.uploadBase64Image(foto);
    }

    if (foto !== null && foto.startsWith("https") === true) {
      fotoURL = foto;
    }

    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        email,
        password,
        username,
        foto: fotoURL === null ? null : fotoURL,
        bio,
      },
    });
  }
}
