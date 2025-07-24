import {
  Put,
  Body,
  Controller,
  NotFoundException,
  Param,
  UseGuards,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { CloudflareR2Service } from "../../services/r2-upload.service";
import { hash } from "bcryptjs";

const editAccountSchema = z.object({
  password: z.string().optional(),
  username: z.string(),
  email: z.string().email(),
  foto: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  role: z.enum(["CLIENT", "ADMIN"]),
});

const bodyValidationPipe = new ZodValidationPipe(editAccountSchema);

type EditAccountSchema = z.infer<typeof editAccountSchema>;

@Controller("/user/:id")
@UseGuards(JwtAuthGuard)
export class EditAccountController {
  constructor(
    private prisma: PrismaService,
    private r2: CloudflareR2Service,
  ) {}

  @Put()
  async handle(
    @Body(bodyValidationPipe) body: EditAccountSchema,
    @Param("id") id: string,
  ) {
    const { bio, email, foto, password, role, username } = body;

    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException("Usuário não encontrado.");
    }

    let fotoURL: string | null = null;

    if (foto !== null && foto !== undefined) {
      if (foto.startsWith("https") === false) {
        if (user?.foto) {
          await this.r2.deleteImageToBucket(user.foto);
        }
        fotoURL = await this.r2.uploadBase64Image(foto);
      } else {
        fotoURL = foto;
      }
    }

    let hashedPassword: string | null = null;

    if (password) {
      hashedPassword = await hash(password, 8);
    }

    // se não mandar nova senha
    if (hashedPassword === null) {
      await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          email,
          username,
          foto: fotoURL,
          bio,
          role,
        },
      });
    } // caso mande nova senha:
    else {
      await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          email,
          username,
          password: hashedPassword,
          foto: fotoURL,
          bio,
          role,
        },
      });
    }
  }
}
