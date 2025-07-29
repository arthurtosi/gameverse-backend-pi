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

@Controller("/platform/:platformId")
@UseGuards(JwtAuthGuard)
export class DeletePlatformByIdController {
  constructor(private prisma: PrismaService) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param("platformId") platformId: string) {
    const platform = await this.prisma.gamePlatform.findUnique({
      where: {
        id: platformId,
      },
    });

    if (!platform) {
      throw new NotFoundException("Plataforma não encontrada.");
    }

    await this.prisma.gamePlatform.delete({
      where: {
        id: platformId,
      },
    });
  }
}
