import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { PrismaService } from "../../prisma/prisma.service";

@Controller("/game/slug/:slug")
@UseGuards(JwtAuthGuard)
export class GetGameBySlugController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Param("slug") slug: string) {
    const game = await this.prisma.game.findUnique({
      where: { slug },
      include: {
        ratings: true,
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

    return {
      ...game,
      averageRating: Math.round(averageRating * 100) / 100,
      totalRatings: game.ratings.length,
    };
  }
}
