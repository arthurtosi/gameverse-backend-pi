import {
  Put,
  Body,
  Controller,
  UseGuards,
  HttpCode,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { CurrentUser } from "../../auth/current-user-decorator";
import { UserPayload } from "../../auth/jwt.strategy";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { CloudflareR2Service } from "../../services/r2-upload.service";
// import { hash } from "bcryptjs";

const editAccountSchema = z.object({
  foto: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
});

const bodyValidationPipe = new ZodValidationPipe(editAccountSchema);

type EditAccountSchema = z.infer<typeof editAccountSchema>;

@Controller("/me")
@UseGuards(JwtAuthGuard)
export class EditMeController {
  constructor(
    private prisma: PrismaService,
    private r2: CloudflareR2Service,
  ) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditAccountSchema,
    @CurrentUser() userPayload: UserPayload,
  ) {
    const { sub: id } = userPayload;
    const { foto, bio } = body;

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
      // se o usuário já tinha uma foto antes, deleta ela.
      if (typeof fotoURL === "string") {
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

    // let hashedPassword: string | null = null;

    // if (password) {
    //   hashedPassword = await hash(password, 8);
    // }

    // se não mandar nova senha
    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        // email,
        // username,
        foto: fotoURL,
        bio,
        // role,
        // password:
        //   typeof hashedPassword === "string" ? hashedPassword : user.password,
      },
    });
  }
}
