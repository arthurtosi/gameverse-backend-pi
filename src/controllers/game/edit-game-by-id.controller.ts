import {
  Body,
  Controller,
  UseGuards,
  Put,
  Param,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { CloudflareR2Service } from "../../services/r2-upload.service";
import { UserPayload } from "../../auth/jwt.strategy";
import { CurrentUser } from "../../auth/current-user-decorator";
import { generateSlug } from "../../utils/gerar-slug";

const editGameSchema = z.object({
  name: z.string(),
  releaseDate: z.string().date(),
  foto: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(editGameSchema);

type EditGameSchema = z.infer<typeof editGameSchema>;

@Controller("/game/:id")
@UseGuards(JwtAuthGuard)
export class EditGameController {
  constructor(
    private prisma: PrismaService,
    private r2: CloudflareR2Service,
  ) {}

  @Put()
  async handle(
    @CurrentUser() userPayload: UserPayload,
    @Body(bodyValidationPipe) body: EditGameSchema,
    @Param("id") id: string,
  ) {
    const { sub } = userPayload;
    const { name, foto, releaseDate } = body;

    const user = await this.prisma.user.findUnique({
      where: {
        id: sub,
      },
    });

    if (!user) {
      throw new UnauthorizedException("Usuário não encontrado.");
    }

    const game = await this.prisma.game.findUnique({
      where: {
        id,
      },
    });

    if (!game) {
      throw new NotFoundException("Jogo não encontrado.");
    }

    const slug = generateSlug(name);

    const gameWithSameSlug = await this.prisma.game.findUnique({
      where: {
        slug,
      },
    });

    if (gameWithSameSlug?.id !== id) {
      throw new ConflictException(
        "Não foi possível editar: Jogo com mesmo nome já está cadastrado.",
      );
    }

    let fotoURL = game.foto;

    // se a foto não for a mesma de antes:
    if (foto.startsWith("https") === false) {
      await this.r2.deleteImageToBucket(game.foto);
      fotoURL = await this.r2.uploadBase64Image(foto);
    }

    await this.prisma.game.update({
      where: {
        id,
      },
      data: {
        foto: fotoURL,
        name,
        releaseDate: new Date(releaseDate),
        slug,
      },
    });
  }
}
