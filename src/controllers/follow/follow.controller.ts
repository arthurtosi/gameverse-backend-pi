import {
  Controller,
  Post,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
  ConflictException,
  Get,
  Delete,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { PrismaService } from "src/prisma/prisma.service";
import { CurrentUser } from "src/auth/current-user-decorator";
import { UserPayload } from "src/auth/jwt.strategy";

@Controller("follow")
@UseGuards(JwtAuthGuard)
export class FollowController {
  constructor(private prisma: PrismaService) {}

  @Post(":followingUserId")
  async followUser(
    @Param("followingUserId") followingUserId: string,
    @CurrentUser() userPayload: UserPayload,
  ) {
    const { sub: followerId } = userPayload;
    if (followerId === followingUserId) {
      throw new HttpException(
        "Não pode seguir você mesmo",
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingFollow = await this.prisma.follow.findFirst({
      where: {
        followerId,
        followingId: followingUserId,
      },
    });

    if (existingFollow) {
      throw new ConflictException("Já seguindo este usuário");
    }

    return this.prisma.follow.create({
      data: {
        followerId,
        followingId: followingUserId,
      },
    });
  }

  @Delete(":followingUserId")
  async unfollowUser(
    @Param("followingUserId") followingUserId: string,
    @CurrentUser() userPayload: UserPayload,
  ) {
    const { sub: followerId } = userPayload;

    const existingFollow = await this.prisma.follow.findFirst({
      where: {
        followerId,
        followingId: followingUserId,
      },
    });

    if (!existingFollow) {
      throw new HttpException(
        "Não está seguindo este usuário",
        HttpStatus.NOT_FOUND,
      );
    }

    return this.prisma.follow.delete({
      where: {
        id: existingFollow.id,
      },
    });
  }

  @Get("following")
  async getFollowing(@CurrentUser() userPayload: UserPayload) {
    const { sub: followerId } = userPayload;
    const follows = await this.prisma.follow.findMany({
      where: {
        followerId,
      },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            foto: true,
          },
        },
      },
    });
    const followingUsers = follows.map((f) => f.following);
    return followingUsers;
  }
  @Get("followers")
  async getFollowers(@CurrentUser() userPayload: UserPayload) {
    const { sub: followingId } = userPayload;
    const followers = await this.prisma.follow.findMany({
      where: {
        followingId,
      },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            foto: true,
          },
        },
      },
    });
    const followerUsers = followers.map((f) => f.follower);
    return followerUsers;
  }
}
