import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { PrismaService } from "../../prisma/prisma.service";

@Controller("/genres")
@UseGuards(JwtAuthGuard)
export class GetAllGenresController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle() {
    const genres = await this.prisma.gameGenre.findMany();

    return genres;
  }
}
