import {
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { PrismaService } from "../../prisma/prisma.service";
import { CurrentUser } from "../../auth/current-user-decorator";
import { UserPayload } from "../../auth/jwt.strategy";
import { CloudflareR2Service } from "../../services/r2-upload.service";

@Controller("/me")
@UseGuards(JwtAuthGuard)
export class DeleteMeController {
  constructor(
    private prisma: PrismaService,
    private r2: CloudflareR2Service,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(@CurrentUser() userPayload: UserPayload) {
    const { sub: id } = userPayload;

    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException("Usuário não encontrado.");
    }

    if (user.foto) {
      await this.r2.deleteImageToBucket(user.foto);
    }

    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
