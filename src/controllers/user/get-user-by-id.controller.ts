import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { PrismaService } from "../../prisma/prisma.service";

@Controller("/user/:id")
@UseGuards(JwtAuthGuard)
export class GetUserByIdController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Param() id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      omit: {
        password: true,
      },
    });

    if (!user) {
      throw new NotFoundException("Usuário não encontrado.");
    }

    return {
      data: user,
    };
  }
}
