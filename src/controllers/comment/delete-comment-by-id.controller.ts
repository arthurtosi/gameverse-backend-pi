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

@Controller("/comment/:commentId")
@UseGuards(JwtAuthGuard)
export class DeleteCommentByIdController {
  constructor(private prisma: PrismaService) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param("commentId") commentId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      throw new NotFoundException("Comentário não encontrado.");
    }

    await this.prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
  }
}
