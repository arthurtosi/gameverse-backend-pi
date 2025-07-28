import {
  Body,
  Controller,
  Post,
  UseGuards,
  UnauthorizedException,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CurrentUser } from "src/auth/current-user-decorator";
import { UserPayload } from "src/auth/jwt.strategy";

const createGameListSchema = z.object({
  title: z.string().min(1, "Título é obrigatório."),
  isPublic: z.boolean(),
  games: z.array(z.string().uuid()).min(1, "Selecione ao menos um jogo."),
});

const bodyValidationPipe = new ZodValidationPipe(createGameListSchema);

type CreateGameListSchema = z.infer<typeof createGameListSchema>;

@Controller("/gamelist")
@UseGuards(JwtAuthGuard)
export class CreateGameListController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateGameListSchema,
    @CurrentUser() userPayload: UserPayload,
  ) {
    const { sub: userId } = userPayload;
    const { title, isPublic, games } = body;

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new UnauthorizedException("Usuário não encontrado.");
    }

    const gameList = await this.prisma.gameList.create({
      data: {
        title,
        isPublic,
        userId,
        relationGameAndGameList: {
          create: games.map((gameId) => ({
            game: { connect: { id: gameId } },
          })),
        },
      },
      include: {
        relationGameAndGameList: {
          include: {
            game: true,
          },
        },
      },
    });

    return gameList;
  }
}
