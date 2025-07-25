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

@Controller("/rating/:id")
@UseGuards(JwtAuthGuard)
export class DeleteRatingByIdController {
  constructor(private prisma: PrismaService) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param("id") id: string) {
    const rating = await this.prisma.rating.findUnique({
      where: {
        id,
      },
    });

    if (!rating) {
      throw new NotFoundException("Avaliação não encontrada.");
    }

    await this.prisma.rating.delete({
      where: {
        id,
      },
    });
  }
}
