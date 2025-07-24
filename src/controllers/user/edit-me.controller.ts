import { Put, Body, Controller, UseGuards, HttpCode } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { CurrentUser } from "../../auth/current-user-decorator";
import { UserPayload } from "../../auth/jwt.strategy";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { CloudflareR2Service } from "../../services/r2-upload.service";
import { hash } from "bcryptjs";

const editAccountSchema = z.object({
  password: z.string().optional(),
  username: z.string(),
  email: z.string().email(),
  foto: z.string().nullable(),
  bio: z.string().nullable(),
  role: z.enum(["CLIENT", "ADMIN"]),
});

const bodyValidationPipe = new ZodValidationPipe(editAccountSchema);

type EditAccountSchema = z.infer<typeof editAccountSchema>;

@Controller("/me")
@UseGuards(JwtAuthGuard)
export class EditMeController {
  constructor(
    private prisma: PrismaService,
    private r2: CloudflareR2Service,
  ) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditAccountSchema,
    @CurrentUser() userPayload: UserPayload,
  ) {
    const { sub: id } = userPayload;
    const { email, password, username, foto, bio, role } = body;

    let fotoURL: string | null = null;

    if (foto !== null) {
      if (foto.startsWith("https") === false) {
        const user = await this.prisma.user.findUnique({
          where: {
            id,
          },
        });
        if (user?.foto) {
          await this.r2.deleteImageToBucket(user.foto);
        }
        fotoURL = await this.r2.uploadBase64Image(foto);
      } else {
        fotoURL = foto;
      }
    }

    let hashedPassword: string | null = null;

    if (password) {
      hashedPassword = await hash(password, 8);
    }

    // se não mandar nova senha
    if (hashedPassword === null) {
      await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          email,
          username,
          foto: fotoURL,
          bio,
          role,
        },
      });
    } // caso mande nova senha:
    else {
      await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          email,
          username,
          password: hashedPassword,
          foto: fotoURL,
          bio,
          role,
        },
      });
    }
  }
}
