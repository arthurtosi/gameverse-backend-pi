import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { PrismaService } from "../../prisma/prisma.service";

@Controller("/game/slug/:slug")
@UseGuards(JwtAuthGuard)
export class GetGameBySlugController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Param("slug") slug: string) {
    const game = await this.prisma.game.findUnique({
      where: {
        slug,
      },
    });

    if (!game) {
      throw new NotFoundException("Jogo não encontrado.");
    }

    return game;
  }
}
