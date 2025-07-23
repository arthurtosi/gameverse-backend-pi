import {
  Controller,
  UseGuards,
  NotFoundException,
  Delete,
  Param,
  HttpCode,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";

@Controller("/user/:id")
@UseGuards(JwtAuthGuard)
export class DeleteUserController {
  constructor(private prisma: PrismaService) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param() id: string) {
    const user = await this.prisma.user.delete({
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
