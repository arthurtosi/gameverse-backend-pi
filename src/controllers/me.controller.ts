import { Get, Controller, UseGuards, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../auth/current-user-decorator";
import { UserPayload } from "../auth/jwt.strategy";
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { MeWrapperResponseDTO } from "../swagger/me.response";

@ApiTags("Me")
@ApiBearerAuth()
@Controller("/me")
@UseGuards(JwtAuthGuard)
export class MeController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiNotFoundResponse({ description: "Usuário não encontrado." })
  @ApiOkResponse({ type: MeWrapperResponseDTO })
  @ApiOperation({ summary: "Retorna dados do usuário autenticado" })
  async handle(@CurrentUser() userPayload: UserPayload) {
    const { sub } = userPayload;

    const user = await this.prisma.user.findUnique({
      where: {
        id: sub,
      },
      omit: {
        password: true,
      },
    });

    if (!user) {
      throw new NotFoundException("Usuário não encontrado.");
    }

    return user;
  }
}
