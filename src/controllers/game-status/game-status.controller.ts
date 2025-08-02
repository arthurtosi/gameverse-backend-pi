import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { CurrentUser } from "../../auth/current-user-decorator";
import { UserPayload } from "../../auth/jwt.strategy";
import { z } from "zod";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { GameStatusEnum } from "@prisma/client";

const createGameStatus = z.object({
  status: z.nativeEnum(GameStatusEnum),
});

const bodyValidationPipe = new ZodValidationPipe(createGameStatus);
type CreateGameStatusSchema = z.infer<typeof createGameStatus>;

@UseGuards(JwtAuthGuard)
@Controller("/game-status")
export class GameStatusController {
  constructor(private prisma: PrismaService) {}

  @Post(":gameId")
  async createOrUpdateGameStatus(
    @CurrentUser() userPayload: UserPayload,
    @Param("gameId") gameId: string,
    @Body(bodyValidationPipe) body: CreateGameStatusSchema,
  ) {
    const { sub: userId } = userPayload;
    const newStatus = body.status;
    const updatedStatus = await this.prisma.userGameStatus.upsert({
      where: {
        userId_gameId: {
          userId,
          gameId,
        },
      },
      update: {
        status: newStatus,
      },
      create: {
        userId,
        gameId,
        status: newStatus,
      },
    });

    return updatedStatus;
  }

  @Get()
  async getGameStatusesForUser(@CurrentUser() userPayload: UserPayload) {
    const { sub: userId } = userPayload;

    const statuses = await this.prisma.userGameStatus.findMany({
      where: { userId },
      select: {
        status: true,
        game: {
          select: {
            id: true,
            name: true,
            slug: true,
            foto: true,
            releaseDate: true,
          },
        },
      },
    });

    return statuses;
  }

  @Get(":gameId")
  async getStatusForGame(
    @CurrentUser() userPayload: UserPayload,
    @Param("gameId") gameId: string,
  ) {
    const { sub: userId } = userPayload;
    const status = await this.prisma.userGameStatus.findUnique({
      where: {
        userId_gameId: {
          userId,
          gameId,
        },
      },
      select: {
        status: true,
      },
    });
    if (!status) {
      return { status: null };
    }
    return status;
  }
}
