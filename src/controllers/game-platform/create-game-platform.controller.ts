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

const createPlatformSchema = z.object({
  name: z.string().nonempty(),
});

const bodyValidationPipe = new ZodValidationPipe(createPlatformSchema);

type CreatePlatformSchema = z.infer<typeof createPlatformSchema>;

@Controller("/platform")
@UseGuards(JwtAuthGuard)
export class CreatePlatformController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: CreatePlatformSchema) {
    const { name } = body;

    const slug = generateSlug(name);

    const platform = await this.prisma.gamePlatform.findUnique({
      where: {
        slug,
      },
    });

    if (platform) {
      throw new ForbiddenException("Plataforma já existe.");
    }

    await this.prisma.gamePlatform.create({
      data: {
        name,
        slug,
      },
    });
  }
}
