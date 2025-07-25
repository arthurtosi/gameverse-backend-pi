import {
  Controller,
  Get,
  Param,
  UseGuards,
  UnauthorizedException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CurrentUser } from "src/auth/current-user-decorator";
import { UserPayload } from "src/auth/jwt.strategy";

@Controller("/gamelists")
@UseGuards(JwtAuthGuard)
export class GetGameListByIdController {
  constructor(private prisma: PrismaService) {}

  @Get("/:listId")
  async handle(
    @Param("listId") listId: string,
    @CurrentUser() userPayload: UserPayload
  ) {
    const { sub: authenticatedUserId } = userPayload;

    const gamelist = await this.prisma.gameList.findUnique({
      where: { id: listId },
      include: {
        relationGameAndGameList: {
          include: {
            game: true,
          },
        },
      },
    });

    if (!gamelist) {
      throw new NotFoundException("Lista de jogos não encontrada.");
    }

    const isOwner = gamelist.userId === authenticatedUserId;
    const isPublic = gamelist.isPublic;

    if (!isOwner && !isPublic) {
      throw new UnauthorizedException("Você não tem acesso a essa lista.");
    }

    return {
      id: gamelist.id,
      title: gamelist.title,
      isPublic: gamelist.isPublic,
      createdAt: gamelist.createdAt,
      userId: gamelist.userId,
      games: gamelist.relationGameAndGameList.map((rel) => rel.game),
    };
  }
}
