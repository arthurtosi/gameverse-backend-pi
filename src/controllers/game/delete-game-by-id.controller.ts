import {
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { PrismaService } from "../../prisma/prisma.service";

@Controller("/game/:id")
@UseGuards(JwtAuthGuard)
export class DeleteGameByIdController {
  constructor(private prisma: PrismaService) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param("id") id: string) {
    const game = await this.prisma.game.findUnique({
      where: {
        id,
      },
    });

    if (!game) {
      throw new NotFoundException("Jogo não encontrado.");
    }

    await this.prisma.game.delete({
      where: {
        id,
      },
    });
  }
}
