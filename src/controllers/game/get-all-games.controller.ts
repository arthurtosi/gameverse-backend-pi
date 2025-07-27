import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { PrismaService } from "../../prisma/prisma.service";

@Controller("/games")
@UseGuards(JwtAuthGuard)
export class GetAllGamesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle() {
    const games = await this.prisma.game.findMany();

    return games;
  }
}
