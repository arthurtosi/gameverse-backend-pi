import { Controller, Get, UseGuards } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { CurrentUser } from "../../auth/current-user-decorator";
import { UserPayload } from "../../auth/jwt.strategy";

@Controller("/feed")
@UseGuards(JwtAuthGuard)
export class FeedController {
  constructor(private prisma: PrismaService) {}
  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserFeed(@CurrentUser() userPayload: UserPayload) {
    const { sub: userId } = userPayload;

    const follows = await this.prisma.follow.findMany({
      where: { followerId: userId },
      select: {
        followingId: true,
      },
    });

    const followingIds = follows.map((f) => f.followingId);

    // Reviews feitas pelos usuarios que ele segue
    const ratings = await this.prisma.rating.findMany({
      where: {
        authorId: { in: followingIds },
      },
      include: {
        user: {
          select: { id: true, username: true, foto: true },
        },
        game: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const lists = await this.prisma.gameList.findMany({
      where: {
        userId: { in: followingIds },
      },
      include: {
        user: {
          select: { id: true, username: true, foto: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const activities = [
      ...ratings.map((r) => ({
        id: r.id,
        type: r.content ? "new_review" : "new_rating",
        createdAt: r.createdAt,
        contentSnippet: r.content || String(r.rate),
        user: r.user,
        targetGame: {
          id: r.game.id,
          title: r.game.name,
        },
      })),
      ...lists.map((l) => ({
        id: l.id,
        type: "new_list",
        createdAt: l.createdAt,
        user: l.user,
        contentSnippet: undefined,
        targetList: {
          id: l.id,
          name: l.title,
        },
      })),
    ];

    // Ordena por data mais recente
    activities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return activities;
  }
}
