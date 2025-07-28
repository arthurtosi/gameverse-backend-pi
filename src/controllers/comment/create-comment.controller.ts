import {
  Body,
  Controller,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { CurrentUser } from "../../auth/current-user-decorator";
import { UserPayload } from "../../auth/jwt.strategy";

const createCommentSchema = z.object({
  content: z.string().nonempty(),
});

const bodyValidationPipe = new ZodValidationPipe(createCommentSchema);

type CreateCommentSchema = z.infer<typeof createCommentSchema>;

@Controller("/comment/:ratingId")
@UseGuards(JwtAuthGuard)
export class CreateCommentController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateCommentSchema,
    @CurrentUser() userPayload: UserPayload,
    @Param("ratingId") ratingId: string,
  ) {
    const { sub: userId } = userPayload;
    const { content } = body;

    const rating = await this.prisma.rating.findUnique({
      where: {
        id: ratingId,
      },
    });

    if (!rating) {
      throw new NotFoundException("Avaliação não encontrada.");
    }

    await this.prisma.comment.create({
      data: {
        content,
        userId,
        ratingId,
      },
    });
  }
}
