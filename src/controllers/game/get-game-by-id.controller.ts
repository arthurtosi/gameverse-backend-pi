import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { PrismaService } from "../../prisma/prisma.service";

@Controller("/game/:id")
@UseGuards(JwtAuthGuard)
export class GetGameByIdController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Param("id") id: string) {
    const game = await this.prisma.game.findUnique({
      where: {
        id,
      },
    });

    if (!game) {
      throw new NotFoundException("Jogo não encontrado.");
    }

    return game;
  }
}
