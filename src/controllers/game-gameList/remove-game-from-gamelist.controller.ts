import {
  ConflictException,
  Controller,
  Delete,
  NotFoundException,
  Param,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { CurrentUser } from "../../auth/current-user-decorator";
import { UserPayload } from "../../auth/jwt.strategy";

@Controller("remove-game-on-gamelist/:gamelistId/:gameId")
@UseGuards(JwtAuthGuard)
export class RemoveGameOnListController {
  constructor(private prisma: PrismaService) {}

  @Delete()
  async handle(
    @CurrentUser() userPayload: UserPayload,
    @Param("gamelistId") gamelistId: string,
    @Param("gameId") gameId: string,
  ) {
    const { sub: userId } = userPayload;

    const gamelist = await this.prisma.gameList.findUnique({
      where: {
        id: gamelistId,
      },
    });

    if (!gamelist) {
      throw new NotFoundException("Lista não encontrada.");
    }

    if (gamelist.userId !== userId) {
      throw new UnauthorizedException(
        "Você não possui autorização para remover jogos dessa lista.",
      );
    }

    const gameOnGameListAlready =
      await this.prisma.relationGameAndGameList.findFirst({
        where: {
          gamelistId,
          gameId,
        },
      });

    if (!gameOnGameListAlready) {
      throw new ConflictException("Jogo não está na lista.");
    }

    await this.prisma.relationGameAndGameList.delete({
      where: {
        id: gameOnGameListAlready.id,
      },
    });
  }
}
