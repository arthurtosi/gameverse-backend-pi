import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";

@Controller("/user-statistics")
@UseGuards(JwtAuthGuard)
export class UserStatisticsController {
  constructor(private prisma: PrismaService) {}

  @Get("favorite-genre/:username")
  async getFavoriteGenre(@Param("username") username: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) {
      throw new NotFoundException("Usuário não encontrado.");
    }
    const statuses = await this.prisma.userGameStatus.findMany({
      where: { userId: user.id },
      select: { gameId: true },
    });
    const gameIds = statuses.map((s) => s.gameId);
    if (gameIds.length === 0) {
      return {
        message: "Usuário não possui jogos registrados.",
        favoriteGenre: null,
      };
    }
    const genres = await this.prisma.relationGameAndGameGenre.findMany({
      where: { gameId: { in: gameIds } },
      include: {
        gameGenre: true,
      },
    });
    if (genres.length === 0) {
      return {
        message: "Nenhum dos jogos do usuário possui gênero cadastrado.",
        favoriteGenre: null,
      };
    }
    const genreCount = genres.reduce(
      (acc, g) => {
        const name = g.gameGenre.name;
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    const sortedGenres = Object.entries(genreCount).sort((a, b) => b[1] - a[1]);
    const favoriteGenre = sortedGenres.length > 0 ? sortedGenres[0][0] : null;

    return { favoriteGenre };
  }
}
