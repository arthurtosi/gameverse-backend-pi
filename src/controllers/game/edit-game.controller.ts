import {
  Body,
  Controller,
  UseGuards,
  Put,
  Param,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { CloudflareR2Service } from "../../services/r2-upload.service";

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
    @Body(bodyValidationPipe) body: EditGameSchema,
    @Param("id") id: string,
  ) {
    const { name, foto, releaseDate } = body;

    const game = await this.prisma.game.findUnique({
      where: {
        id,
      },
    });

    if (!game) {
      throw new NotFoundException("Jogo não encontrado.");
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
        releaseDate,
      },
    });
  }
}
