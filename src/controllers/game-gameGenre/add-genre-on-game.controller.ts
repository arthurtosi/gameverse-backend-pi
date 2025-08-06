import {
  Body,
  ConflictException,
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
const addGenreOnGameSchema = z.object({
  genreId: z.string().uuid(),
});

const bodyValidationPipe = new ZodValidationPipe(addGenreOnGameSchema);

type AddGenreOnGameSchema = z.infer<typeof addGenreOnGameSchema>;

@Controller("add-genre-on-game/:gameId")
@UseGuards(JwtAuthGuard)
export class AddGenreOnGameController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: AddGenreOnGameSchema,
    @Param("gameId") gameId: string,
  ) {
    const { genreId } = body;

    const game = await this.prisma.game.findUnique({
      where: {
        id: gameId,
      },
    });

    if (!game) {
      throw new NotFoundException("Jogo não encontrado.");
    }

    const genreExists = await this.prisma.gameGenre.findUnique({
      where: {
        id: genreId,
      },
    });

    if (!genreExists) {
      throw new NotFoundException("Gênero não encontrado.");
    }

    const genreOnGameAlready =
      await this.prisma.relationGameAndGameGenre.findFirst({
        where: {
          gameGenreId: genreId,
          gameId,
        },
      });

    if (genreOnGameAlready) {
      throw new ConflictException("Gênero já está ligado ao jogo.");
    }

    await this.prisma.relationGameAndGameGenre.createMany({
      data: {
        gameGenreId: genreId,
        gameId,
      },
    });
  }
}
