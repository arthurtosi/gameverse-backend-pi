import {
  Body,
  ConflictException,
  Controller,
  NotFoundException,
  Param,
  Post,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { CurrentUser } from "../../auth/current-user-decorator";
import { UserPayload } from "../../auth/jwt.strategy";

const addGameOnGamelistSchema = z.object({
  gameId: z.string().uuid(),
});

const bodyValidationPipe = new ZodValidationPipe(addGameOnGamelistSchema);

type AddGameOnListSchema = z.infer<typeof addGameOnGamelistSchema>;

@Controller("add-game-on-gamelist/:gamelistId")
@UseGuards(JwtAuthGuard)
export class AddGameOnListController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: AddGameOnListSchema,
    @CurrentUser() userPayload: UserPayload,
    @Param("gamelistId") gamelistId: string,
  ) {
    const { sub: userId } = userPayload;
    const { gameId } = body;

    const gamelist = await this.prisma.gameList.findUnique({
      where: {
        id: gamelistId,
      },
    });

    if (!gamelist) {
      throw new NotFoundException("Lista não encontrada.");
    }

    if (gamelist.userId !== userId) {
      throw new UnauthorizedException(
        "Você não possui autorização para adicionar jogos a essa lista.",
      );
    }

    const gameOnGameListAlready =
      await this.prisma.relationGameAndGameList.findFirst({
        where: {
          gamelistId,
          gameId,
        },
      });

    if (gameOnGameListAlready) {
      throw new ConflictException("Jogo já está adicionado à lista");
    }

    await this.prisma.relationGameAndGameList.createMany({
      data: {
        gamelistId,
        gameId,
      },
    });
  }
}
