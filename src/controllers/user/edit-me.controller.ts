import { Put, UsePipes, Body, Controller, UseGuards } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { CurrentUser } from "../../auth/current-user-decorator";
import { UserPayload } from "../../auth/jwt.strategy";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";

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
  constructor(private prisma: PrismaService) {}

  @Put()
  @UsePipes(new ZodValidationPipe(editAccountSchema))
  async handle(
    @Body() body: EditAccountSchema,
    @CurrentUser() userPayload: UserPayload,
  ) {
    const { sub: id } = userPayload;
    const { email, password, username, foto, bio } = body;

    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        email,
        password,
        username,
        foto,
        bio,
      },
    });
  }
}
