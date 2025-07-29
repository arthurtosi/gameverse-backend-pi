import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { PrismaService } from "../../prisma/prisma.service";
import { z } from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { generateSlug } from "../../utils/gerar-slug";

const editGenreSchema = z.object({
  name: z.string().nonempty(),
});

const bodyValidationPipe = new ZodValidationPipe(editGenreSchema);

type EditGenreSchema = z.infer<typeof editGenreSchema>;

@Controller("/genre/:genreId")
@UseGuards(JwtAuthGuard)
export class EditGenreByIdController {
  constructor(private prisma: PrismaService) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditGenreSchema,
    @Param("genreId") genreId: string,
  ) {
    const { name } = body;
    const genre = await this.prisma.gameGenre.findUnique({
      where: {
        id: genreId,
      },
    });

    if (!genre) {
      throw new NotFoundException("Plataforma não encontrada.");
    }

    const slug = generateSlug(name);

    const genreWithSameSlug = await this.prisma.gameGenre.findUnique({
      where: {
        slug,
      },
    });

    if (genreWithSameSlug && genreWithSameSlug.id !== genreId) {
      throw new ForbiddenException("Plataforma com mesmo nome já cadastrada.");
    }

    await this.prisma.gameGenre.update({
      where: {
        id: genreId,
      },
      data: {
        name,
        slug,
      },
    });
  }
}
