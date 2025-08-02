import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { PrismaService } from "../../prisma/prisma.service";

@Controller("/game/:id")
@UseGuards(JwtAuthGuard)
export class GetGameByIdController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Param("id") id: string) {
    const game = await this.prisma.game.findUnique({
      where: { id },
      include: {
        ratings: {
          select: {
            rate: true,
          },
        },
        RelationGameAndGameGenre: {
          include: {
            gameGenre: true,
          },
        },
        RelationGameAndGamePlatform: {
          include: {
            gamePlatform: true,
          },
        },
      },
    });

    if (!game) {
      throw new NotFoundException("Jogo não encontrado.");
    }

    const averageRating =
      game.ratings.length > 0
        ? game.ratings.reduce((sum, rating) => sum + rating.rate, 0) /
          game.ratings.length
        : 0;

    const genres = game.RelationGameAndGameGenre.map(
      (relation) => relation.gameGenre.name,
    );
    const platforms = game.RelationGameAndGamePlatform.map(
      (relation) => relation.gamePlatform.name,
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
  }
}
