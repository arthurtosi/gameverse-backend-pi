import {
  Body,
  Controller,
  NotFoundException,
  Param,
  Put,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { CurrentUser } from "../../auth/current-user-decorator";
import { UserPayload } from "../../auth/jwt.strategy";

const editCommentSchema = z.object({
  content: z.string().nonempty(),
});

const bodyValidationPipe = new ZodValidationPipe(editCommentSchema);

type EditCommentSchema = z.infer<typeof editCommentSchema>;

@Controller("/comment/:id")
@UseGuards(JwtAuthGuard)
export class EditCommentController {
  constructor(private prisma: PrismaService) {}

  @Put()
  async handle(
    @Body(bodyValidationPipe) body: EditCommentSchema,
    @CurrentUser() userPayload: UserPayload,
    @Param("id") id: string,
  ) {
    const { sub: userId } = userPayload;
    const { content } = body;

    const comment = await this.prisma.comment.findUnique({
      where: {
        id: id,
      },
    });

    if (!comment) {
      throw new NotFoundException("Comentário não encontrado.");
    }

    if (comment.userId !== userId) {
      throw new UnauthorizedException(
        "Você não tem permissão para editar esse comentário",
      );
    }

    await this.prisma.comment.update({
      where: {
        id,
      },
      data: {
        content,
      },
    });
  }
}
