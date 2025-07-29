import {
  Body,
  Controller,
  ForbiddenException,
  Post,
  UseGuards,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { generateSlug } from "../../utils/gerar-slug";

const createGenreSchema = z.object({
  name: z.string().nonempty(),
});

const bodyValidationPipe = new ZodValidationPipe(createGenreSchema);

type CreateGenreSchema = z.infer<typeof createGenreSchema>;

@Controller("/genre")
@UseGuards(JwtAuthGuard)
export class CreateGenreController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: CreateGenreSchema) {
    const { name } = body;

    const slug = generateSlug(name);

    const genre = await this.prisma.gameGenre.findUnique({
      where: {
        slug,
      },
    });

    if (genre) {
      throw new ForbiddenException("Gênero já existe.");
    }

    await this.prisma.gameGenre.create({
      data: {
        name,
        slug,
      },
    });
  }
}
