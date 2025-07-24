import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { PrismaService } from "../../prisma/prisma.service";

@Controller("/game/name/:name")
@UseGuards(JwtAuthGuard)
export class GetGameByNameController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Param("name") name: string) {
    const game = await this.prisma.game.findUnique({
      where: {
        name,
      },
    });

    if (!game) {
      throw new NotFoundException("Jogo não encontrado.");
    }

    return {
      data: game,
    };
  }
}
