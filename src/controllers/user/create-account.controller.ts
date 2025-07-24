import {
  ConflictException,
  UsePipes,
  Body,
  Controller,
  Post,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { hash } from "bcryptjs";
import { z } from "zod";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";

const createAccountSchema = z.object({
  password: z.string(),
  username: z.string(),
  email: z.string().email(),
  role: z.enum(["CLIENT", "ADMIN"]).optional(),
});

type CreateAccountSchema = z.infer<typeof createAccountSchema>;

@Controller("/user")
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createAccountSchema))
  async handle(@Body() body: CreateAccountSchema) {
    const { email, password, username, role } = body;

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userWithSameEmail) {
      throw new ConflictException("Usuário com mesmo email já existe.");
    }

    const userWithSameUsername = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (userWithSameUsername) {
      throw new ConflictException("Usuário com mesmo username já existe.");
    }

    const hashedPassword = await hash(password, 8);

    await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        role,
      },
    });
  }
}
