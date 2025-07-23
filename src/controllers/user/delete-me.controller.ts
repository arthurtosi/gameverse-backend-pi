import {
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { PrismaService } from "../../prisma/prisma.service";
import { CurrentUser } from "../../auth/current-user-decorator";
import { UserPayload } from "../../auth/jwt.strategy";

@Controller("/me")
@UseGuards(JwtAuthGuard)
export class DeleteMeController {
  constructor(private prisma: PrismaService) {}

  @Delete()
  @HttpCode(204)
  async handle(@CurrentUser() userPayload: UserPayload) {
    const { sub: id } = userPayload;

    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException("Usuário não encontrado.");
    }

    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
