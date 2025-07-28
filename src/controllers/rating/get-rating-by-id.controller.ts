import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { PrismaService } from "../../prisma/prisma.service";

@Controller("/rating/:id")
@UseGuards(JwtAuthGuard)
export class GetRatingByIdController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Param("id") id: string) {
    const rating = await this.prisma.rating.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          omit: {
            password: true,
          },
        },
        game: true,
      },
    });

    if (!rating) {
      throw new NotFoundException("Avaliação não encontrada.");
    }

    return rating;
  }
}
