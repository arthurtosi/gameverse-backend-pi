import { ConflictException, UsePipes } from "@nestjs/common";
import { Body, Controller, Post } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { hash } from "bcryptjs";
import { z } from "zod";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";

const createAccountSchema = z.object({
  password: z.string(),
  username: z.string(),
  email: z.string().email(),
});

type CreateAccountSchema = z.infer<typeof createAccountSchema>;

@Controller("/user")
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createAccountSchema))
  async handle(@Body() body: CreateAccountSchema) {
    const { email, password, username } = body;

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userWithSameEmail) {
      throw new ConflictException("User with same e-mail already exists.");
    }

    const userWithSameUsername = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (userWithSameUsername) {
      throw new ConflictException("User with same username already exists.");
    }

    const hashedPassword = await hash(password, 8);

    await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
      },
    });
  }
}
