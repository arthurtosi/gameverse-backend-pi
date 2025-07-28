import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { PrismaService } from "../../prisma/prisma.service";

@Controller("/comment/:commentId")
@UseGuards(JwtAuthGuard)
export class GetCommentByIdController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Param("commentId") commentId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      throw new NotFoundException("Comentário não encontrado.");
    }

    return comment;
  }
}
