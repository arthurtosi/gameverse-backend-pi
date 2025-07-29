import {
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { PrismaService } from "../../prisma/prisma.service";

@Controller("/genre/:genreId")
@UseGuards(JwtAuthGuard)
export class DeleteGenreByIdController {
  constructor(private prisma: PrismaService) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param("genreId") genreId: string) {
    const genre = await this.prisma.gameGenre.findUnique({
      where: {
        id: genreId,
      },
    });

    if (!genre) {
      throw new NotFoundException("Gênero não encontrado.");
    }

    await this.prisma.gameGenre.delete({
      where: {
        id: genreId,
      },
    });
  }
}
