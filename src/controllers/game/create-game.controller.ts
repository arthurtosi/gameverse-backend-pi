import {
  ConflictException,
  Body,
  Controller,
  Post,
  UseGuards,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { CloudflareR2Service } from "../../services/r2-upload.service";
import { CurrentUser } from "../../auth/current-user-decorator";
import { UserPayload } from "../../auth/jwt.strategy";
import { generateSlug } from "../../utils/gerar-slug";

const createGameSchema = z.object({
  name: z.string(),
  releaseDate: z.string().date(),
  foto: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(createGameSchema);

type CreateGameSchema = z.infer<typeof createGameSchema>;

@Controller("/game")
@UseGuards(JwtAuthGuard)
export class CreateGameController {
  constructor(
    private prisma: PrismaService,
    private r2: CloudflareR2Service,
  ) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateGameSchema,
    @CurrentUser() userPayload: UserPayload,
  ) {
    const { sub: id } = userPayload;
    const { name, foto, releaseDate } = body;

    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new UnauthorizedException("Usuário não encontrado.");
    }

    const gameWithSameName = await this.prisma.game.findUnique({
      where: {
        name,
      },
    });

    if (gameWithSameName) {
      throw new ConflictException("Jogo com mesmo nome já existe.");
    }

    const slug = generateSlug(name);

    const gameWithSameSlug = await this.prisma.game.findUnique({
      where: {
        slug,
      },
    });

    if (gameWithSameSlug) {
      throw new ConflictException("Jogo com mesmo slug já existe.");
    }

    const fotoURL = await this.r2.uploadBase64Image(foto);

    await this.prisma.game.create({
      data: {
        foto: fotoURL,
        name,
        releaseDate: new Date(releaseDate),
        slug,
      },
    });
  }
}
