import {
  ConflictException,
  Controller,
  Delete,
  NotFoundException,
  Param,
  UseGuards,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { CurrentUser } from "../../auth/current-user-decorator";
import { UserPayload } from "../../auth/jwt.strategy";

@Controller("remove-game-on-gamelist/:genreId/:gameId")
@UseGuards(JwtAuthGuard)
export class RemoveGameOnListController {
  constructor(private prisma: PrismaService) {}

  @Delete()
  async handle(
    @CurrentUser() userPayload: UserPayload,
    @Param("genreId") genreId: string,
    @Param("gameId") gameId: string,
  ) {
    const game = await this.prisma.game.findUnique({
      where: {
        id: gameId,
      },
    });

    if (!game) {
      throw new NotFoundException("Jogo não encontrado.");
    }

    const genre = await this.prisma.gameGenre.findUnique({
      where: {
        id: genreId,
      },
    });

    if (!genre) {
      throw new NotFoundException("Gênero não encontrado.");
    }

    const genreOnGameAlready =
      await this.prisma.relationGameAndGameGenre.findFirst({
        where: {
          gameGenreId: genreId,
          gameId,
        },
      });

    if (!genreOnGameAlready) {
      throw new ConflictException("Gênero não está no jogo.");
    }

    await this.prisma.relationGameAndGameGenre.delete({
      where: {
        id: genreOnGameAlready.id,
      },
    });
  }
}
