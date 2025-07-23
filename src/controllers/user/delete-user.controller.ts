import {
  Controller,
  UseGuards,
  NotFoundException,
  Delete,
  Param,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";

@Controller("/user/:id")
@UseGuards(JwtAuthGuard)
export class DeleteUserController {
  constructor(private prisma: PrismaService) {}

  @Delete()
  async handle(@Param() id: string) {
    if (!id) {
      throw new BadRequestException("ID não encontrado.");
    }

    const user = await this.prisma.user.delete({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException("Usuário não encontrado.");
    }

    return {
      user,
    };
  }
}
