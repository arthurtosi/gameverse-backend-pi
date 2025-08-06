import {
  Body,
  Controller,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
const addGenresOnGameSchema = z.object({
  genreIds: z.array(z.string().uuid()),
});

const bodyValidationPipe = new ZodValidationPipe(addGenresOnGameSchema);

type AddGenresOnGameSchema = z.infer<typeof addGenresOnGameSchema>;

@Controller("add-genres-on-game/:gameId")
@UseGuards(JwtAuthGuard)
export class AddGenresOnGameController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: AddGenresOnGameSchema,
    @Param("gameId") gameId: string,
  ) {
    const { genreIds } = body;

    const game = await this.prisma.game.findUnique({
      where: {
        id: gameId,
      },
    });

    if (!game) {
      throw new NotFoundException("Jogo não encontrado.");
    }

    const existingGenres = await this.prisma.gameGenre.findMany({
      select: { id: true },
    });

    const existingGenreIds = existingGenres.map((g) => g.id);

    const invalidGenres = genreIds.filter(
      (id) => !existingGenreIds.includes(id),
    );
    if (invalidGenres.length > 0) {
      throw new NotFoundException(
        `Os seguintes gêneros não foram encontrados: ${invalidGenres.join(", ")}`,
      );
    }

    await this.prisma.relationGameAndGameGenre.deleteMany({
      where: {
        gameId,
      },
    });

    const data = genreIds.map((genreId) => {
      return {
        gameId,
        gameGenreId: genreId,
      };
    });

    await this.prisma.relationGameAndGameGenre.createMany({
      data,
    });
  }
}
