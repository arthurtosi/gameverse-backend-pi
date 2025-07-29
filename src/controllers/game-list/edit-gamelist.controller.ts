import {
  Body,
  Controller,
  UseGuards,
  Param,
  Put,
  NotFoundException,
  HttpCode,
  UnauthorizedException,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CurrentUser } from "../../auth/current-user-decorator";
import { UserPayload } from "../../auth/jwt.strategy";

const editGameListSchema = z.object({
  title: z.string().nonempty(),
  isPublic: z.boolean(),
  description: z.string().optional().nullable(),
});

const bodyValidationPipe = new ZodValidationPipe(editGameListSchema);

type EditGameListSchema = z.infer<typeof editGameListSchema>;

@Controller("/gamelist/:gamelistId")
@UseGuards(JwtAuthGuard)
export class EditGameListByIdController {
  constructor(private prisma: PrismaService) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditGameListSchema,
    @Param("gamelistId") gamelistId: string,
    @CurrentUser() userPayload: UserPayload,
  ) {
    const { title, isPublic, description } = body;
    const { sub: userId } = userPayload;

    const gameList = await this.prisma.gameList.findUnique({
      where: {
        id: gamelistId,
      },
    });

    if (!gameList) {
      throw new NotFoundException("Lista de jogos não encontrada.");
    }

    if (gameList.userId !== userId) {
      throw new UnauthorizedException(
        "Você não pode editar essa lista de jogos.",
      );
    }

    await this.prisma.gameList.update({
      where: {
        id: gamelistId,
      },
      data: {
        title,
        isPublic,
        description,
      },
    });
  }
}
