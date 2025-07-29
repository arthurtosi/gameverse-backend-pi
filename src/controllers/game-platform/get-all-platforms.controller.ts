import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { PrismaService } from "../../prisma/prisma.service";

@Controller("/platforms")
@UseGuards(JwtAuthGuard)
export class GetAllPlatformsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle() {
    const platforms = await this.prisma.gamePlatform.findMany();

    return platforms;
  }
}
