import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { PrismaService } from "../../prisma/prisma.service";

@Controller("/ratings/game/:id")
@UseGuards(JwtAuthGuard)
export class GetRatingsByGameIdController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Param("id") gameId: string) {
    const ratings = await this.prisma.rating.findMany({
      where: {
        gameId,
      },
      include: {
        user: {
          omit: {
            password: false,
          },
        },
      },
    });

    return ratings;
  }
}
