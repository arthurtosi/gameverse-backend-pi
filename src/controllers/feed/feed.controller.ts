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
  async getUserFeed(@CurrentUser() userPayload: UserPayload) {
    const { sub: userId } = userPayload;

    const follows = await this.prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });

    const followingIds = follows.map((f) => f.followingId);

    // Avaliações
    const ratings = await this.prisma.rating.findMany({
      where: { authorId: { in: followingIds } },
      include: {
        user: { select: { id: true, username: true, foto: true } },
        game: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Listas
    const lists = await this.prisma.gameList.findMany({
      where: { userId: { in: followingIds } },
      include: {
        user: { select: { id: true, username: true, foto: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Atualizações de status
    const statuses = await this.prisma.userGameStatus.findMany({
      where: { userId: { in: followingIds } },
      include: {
        user: { select: { id: true, username: true, foto: true } },
        game: { select: { id: true, name: true } },
      },
      orderBy: { updatedAt: "desc" },
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
      ...statuses.map((s) => ({
        id: s.id,
        type: "game_status_update",
        createdAt: s.updatedAt,
        user: s.user,
        contentSnippet: s.status, // exemplo: "PLAYING"
        targetGame: {
          id: s.game.id,
          title: s.game.name,
        },
      })),
    ];

    activities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return activities;
  }
}
