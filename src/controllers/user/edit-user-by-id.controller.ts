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

    // foto antiga do usuário
    let fotoURL: string | null = user.foto;

    // se mandar uma foto e ela for nula ou se mandar uma foto e ela for um base64
    if (
      foto === null ||
      (typeof foto === "string" && foto.startsWith("https") === false)
    ) {
      if (typeof fotoURL === "string") {
        // se o usuário já tinha uma foto antes, deleta ela.
        await this.r2.deleteImageToBucket(fotoURL);
      }
      // se a nova foto for um base 64
      if (typeof foto === "string") {
        fotoURL = await this.r2.uploadBase64Image(foto);
      }
      // se a nova foto for null
      else {
        fotoURL = null;
      }
    }

    let hashedPassword: string | null = null;

    if (password) {
      hashedPassword = await hash(password, 8);
    }

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
        password:
          typeof hashedPassword === "string" ? hashedPassword : user.password,
      },
    });
  }
}
