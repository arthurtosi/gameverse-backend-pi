import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { PrismaService } from "../../prisma/prisma.service";

@Controller("/genre/:genreId")
@UseGuards(JwtAuthGuard)
export class GetGenreByIdController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Param("genreId") genreId: string) {
    const genre = await this.prisma.gameGenre.findUnique({
      where: {
        id: genreId,
      },
    });

    if (!genre) {
      throw new NotFoundException("Plataforma não encontrada.");
    }

    return genre;
  }
}
