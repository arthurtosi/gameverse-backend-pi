import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { PrismaService } from "../../prisma/prisma.service";

@Controller("/games")
@UseGuards(JwtAuthGuard)
export class GetAllGamesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle() {
    const games = await this.prisma.game.findMany({
      include: {
        ratings: {
          select: { rate: true },
        },
        RelationGameAndGameGenre: {
          include: { gameGenre: true },
        },
        RelationGameAndGamePlatform: {
          include: { gamePlatform: true },
        },
      },
    });

    const formattedGames = games.map((game) => {
      const averageRating =
        game.ratings.length > 0
          ? game.ratings.reduce((sum, r) => sum + r.rate, 0) /
            game.ratings.length
          : 0;

      const genres = game.RelationGameAndGameGenre.map(
        (rel) => rel.gameGenre.name
      );

      const platforms = game.RelationGameAndGamePlatform.map(
        (rel) => rel.gamePlatform.name
      );

      const {
        ratings,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        RelationGameAndGameGenre,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        RelationGameAndGamePlatform,
        ...gameData
      } = game;

      return {
        ...gameData,
        genres,
        platforms,
        averageRating: Math.round(averageRating * 100) / 100,
        totalRatings: ratings.length,
      };
    });

    return formattedGames;
  }
}
