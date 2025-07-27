import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { PrismaService } from "../../prisma/prisma.service";

@Controller("/users")
@UseGuards(JwtAuthGuard)
export class GetAllUsersController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle() {
    const users = await this.prisma.user.findMany({
      omit: {
        password: true,
      },
    });

    return users;
  }
}
