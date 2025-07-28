import {
  Controller,
  UseGuards,
  NotFoundException,
  Delete,
  Param,
  HttpCode,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { CloudflareR2Service } from "../../services/r2-upload.service";

@Controller("/user/:id")
@UseGuards(JwtAuthGuard)
export class DeleteUserController {
  constructor(
    private prisma: PrismaService,
    private r2: CloudflareR2Service,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param("id") id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException("Usuário não encontrado.");
    }

    if (user.foto) {
      await this.r2.deleteImageToBucket(user.foto);
    }

    await this.prisma.rating.deleteMany({
      where: {
        authorId: id,
      },
    });

    await this.prisma.comment.deleteMany({
      where: {
        userId: id,
      },
    });

    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
