import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { PrismaService } from "../../prisma/prisma.service";

@Controller("/games/:substring")
@UseGuards(JwtAuthGuard)
export class GetAllGamesWithSubstringController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Param("substring") substring: string) {
    const games = await this.prisma.game.findMany({
      where: {
        name: {
          contains: substring,
        },
      },
    });

    return {
      data: games,
    };
  }
}
