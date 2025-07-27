import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { PrismaService } from "../../prisma/prisma.service";

@Controller("/ratings")
@UseGuards(JwtAuthGuard)
export class GetAllRatingsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle() {
    const ratings = await this.prisma.rating.findMany();

    return ratings;
  }
}
