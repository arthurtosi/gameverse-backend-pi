import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { PrismaService } from "../../prisma/prisma.service";

@Controller("/comments/user/:userId")
@UseGuards(JwtAuthGuard)
export class GetCommentsOfAnUserController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Param("userId") userId: string) {
    const comments = await this.prisma.comment.findMany({
      where: {
        userId,
      },
      include: {
        rating: {
          include: {
            game: true,
            user: {
              omit: {
                password: true,
              },
            },
          },
        },
      },
    });

    return comments;
  }
}
