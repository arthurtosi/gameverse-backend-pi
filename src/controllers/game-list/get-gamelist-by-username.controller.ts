import {
  Controller,
  Get,
  Param,
  UseGuards,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CurrentUser } from "src/auth/current-user-decorator";
import { UserPayload } from "src/auth/jwt.strategy";

@Controller("/gamelists/username")
@UseGuards(JwtAuthGuard)
export class GetGamelistsByUsernameController {
  constructor(private prisma: PrismaService) {}

  @Get("/:username")
  async handle(
    @Param("username") usernameParam: string,
    @CurrentUser() userPayload: UserPayload,
  ) {
    const { sub: authenticatedUserId } = userPayload;

    const user = await this.prisma.user.findUnique({
      where: { username: usernameParam },
    });

    if (!user) {
      throw new UnauthorizedException("Usuário não encontrado.");
    }

    // Proprio usuario => retorna todas (publicas + privadas)
    // Outro usuario => retorna apenas públicas
    const whereCondition =
      user.id === authenticatedUserId
        ? { userId: user.id }
        : { userId: user.id, isPublic: true };

    const gamelists = await this.prisma.gameList.findMany({
      where: whereCondition,
      include: {
        relationGameAndGameList: {
          include: {
            game: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return gamelists.map((list) => ({
      id: list.id,
      title: list.title,
      isPublic: list.isPublic,
      createdAt: list.createdAt,
      userId: list.userId,
      games: list.relationGameAndGameList.map((rel) => rel.game),
    }));
  }
}
