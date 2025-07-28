import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { PrismaService } from "../../prisma/prisma.service";

@Controller("/ratings/user/:id")
@UseGuards(JwtAuthGuard)
export class GetRatingsByUserIdController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Param("id") userId: string) {
    const ratings = await this.prisma.rating.findMany({
      where: {
        authorId: userId,
      },
      include: {
        game: true,
      },
    });

    return ratings;
  }
}
