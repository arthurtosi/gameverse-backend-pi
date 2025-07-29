import {
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  UseGuards,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("/gamelist/:gamelistId")
@UseGuards(JwtAuthGuard)
export class DeleteGameListByIdController {
  constructor(private prisma: PrismaService) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param("gamelistId") gamelistId: string) {
    const gameList = await this.prisma.gameList.findUnique({
      where: {
        id: gamelistId,
      },
    });

    if (!gameList) {
      throw new NotFoundException("Lista de jogos não encontrada.");
    }

    await this.prisma.gameList.delete({
      where: {
        id: gamelistId,
      },
    });
  }
}
