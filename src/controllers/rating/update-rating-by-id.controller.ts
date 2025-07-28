import {
  Body,
  Controller,
  UseGuards,
  UnauthorizedException,
  Param,
  Put,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { CurrentUser } from "../../auth/current-user-decorator";
import { UserPayload } from "../../auth/jwt.strategy";

const updateRatingSchema = z.object({
  content: z.string(),
  rate: z.number().min(0).max(10).int(),
  title: z.string(),
  gameId: z.string().uuid(),
});

const bodyValidationPipe = new ZodValidationPipe(updateRatingSchema);

type UpdateRatingSchema = z.infer<typeof updateRatingSchema>;

@Controller("/rating/:id")
@UseGuards(JwtAuthGuard)
export class UpdateRatingController {
  constructor(private prisma: PrismaService) {}

  @Put()
  async handle(
    @Body(bodyValidationPipe) body: UpdateRatingSchema,
    @CurrentUser() userPayload: UserPayload,
    @Param("id") id: string,
  ) {
    const { sub: userId } = userPayload;
    const { content, gameId, rate, title } = body;

    const ratingExists = await this.prisma.rating.findUnique({
      where: {
        id,
      },
    });

    if (!ratingExists) {
      throw new UnauthorizedException("Avaliação não encontrada.");
    }

    if (ratingExists.authorId !== userId) {
      throw new UnauthorizedException(
        "Você não possui autorização para alterar esse dado.",
      );
    }

    await this.prisma.rating.update({
      where: {
        id,
      },
      data: {
        authorId: userId,
        content,
        gameId,
        rate,
        title,
      },
    });
  }
}
