import {
  Body,
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

const addGamesOnGamelistSchema = z.object({
  gameIds: z.array(z.string().uuid()),
});

const bodyValidationPipe = new ZodValidationPipe(addGamesOnGamelistSchema);

type AddGamesOnListSchema = z.infer<typeof addGamesOnGamelistSchema>;

@Controller("add-games-on-gamelist/:gamelistId")
@UseGuards(JwtAuthGuard)
export class AddGamesOnListController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: AddGamesOnListSchema,
    @CurrentUser() userPayload: UserPayload,
    @Param("gamelistId") gamelistId: string,
  ) {
    const { sub: userId } = userPayload;
    const { gameIds } = body;

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

    const data = gameIds.map((gameId) => {
      return {
        gameId: gameId,
        gamelistId: gamelistId,
      };
    });

    await this.prisma.relationGameAndGameList.deleteMany({
      where: {
        gamelistId,
      },
    });

    await this.prisma.relationGameAndGameList.createMany({
      data,
    });
  }
}
