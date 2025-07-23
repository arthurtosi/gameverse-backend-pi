import {
  Put,
  UsePipes,
  Body,
  Controller,
  NotFoundException,
  Param,
  HttpCode,
  UseGuards,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";

const editAccountSchema = z.object({
  password: z.string(),
  username: z.string(),
  email: z.string().email(),
  foto: z.string().nullable(),
  bio: z.string().nullable(),
});

type EditAccountSchema = z.infer<typeof editAccountSchema>;

@Controller("/user/:id")
@UseGuards(JwtAuthGuard)
export class EditAccountController {
  constructor(private prisma: PrismaService) {}

  @Put()
  @UsePipes(new ZodValidationPipe(editAccountSchema))
  @HttpCode(204)
  async handle(@Body() body: EditAccountSchema, @Param() id: string) {
    const { email, password, username, foto, bio } = body;

    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException("Usuário não encontrado.");
    }

    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        email,
        password,
        username,
        foto,
        bio,
      },
    });
  }
}
