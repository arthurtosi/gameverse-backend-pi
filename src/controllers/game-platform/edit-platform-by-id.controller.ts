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

const editPlatformSchema = z.object({
  name: z.string().nonempty(),
});

const bodyValidationPipe = new ZodValidationPipe(editPlatformSchema);

type EditPlatformSchema = z.infer<typeof editPlatformSchema>;

@Controller("/platform/:platformId")
@UseGuards(JwtAuthGuard)
export class EditPlatformByIdController {
  constructor(private prisma: PrismaService) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditPlatformSchema,
    @Param("platformId") platformId: string,
  ) {
    const { name } = body;
    const platform = await this.prisma.gamePlatform.findUnique({
      where: {
        id: platformId,
      },
    });

    if (!platform) {
      throw new NotFoundException("Plataforma não encontrada.");
    }

    const slug = generateSlug(name);

    const platformWithSameSlug = await this.prisma.gamePlatform.findUnique({
      where: {
        slug,
      },
    });

    if (platformWithSameSlug && platformWithSameSlug.id !== platformId) {
      throw new ForbiddenException("Plataforma com mesmo nome já cadastrada.");
    }

    await this.prisma.gamePlatform.update({
      where: {
        id: platformId,
      },
      data: {
        name,
        slug,
      },
    });
  }
}
