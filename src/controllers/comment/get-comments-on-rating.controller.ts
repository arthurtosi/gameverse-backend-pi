import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { PrismaService } from "../../prisma/prisma.service";

@Controller("/comments/rating/:ratingId")
@UseGuards(JwtAuthGuard)
export class GetCommentsOnRatingController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Param("ratingId") ratingId: string) {
    const comments = await this.prisma.comment.findMany({
      where: {
        ratingId,
      },
      include: {
        user: {
          omit: {
            password: true,
          },
        },
      },
    });

    return comments;
  }
}
