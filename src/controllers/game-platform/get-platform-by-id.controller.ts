import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { PrismaService } from "../../prisma/prisma.service";

@Controller("/platform/:platformId")
@UseGuards(JwtAuthGuard)
export class GetPlatformByIdController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Param("platformId") platformId: string) {
    const platform = await this.prisma.gamePlatform.findUnique({
      where: {
        id: platformId,
      },
    });

    if (!platform) {
      throw new NotFoundException("Plataforma não encontrada.");
    }

    return platform;
  }
}
