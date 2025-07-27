import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { PrismaService } from "../../prisma/prisma.service";

@Controller("/user/username/:username")
@UseGuards(JwtAuthGuard)
export class GetUserByUsernameController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Param("username") username: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
      omit: {
        password: true,
      },
    });

    if (!user) {
      throw new NotFoundException("Usuário não encontrado.");
    }

    return user;
  }
}
