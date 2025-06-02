import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { CreateAccountController } from "./controllers/create-account.controller";
import { ConfigModule } from "@nestjs/config";
import { envSchema } from "./env";
import { AuthModule } from "./auth/auth.module";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { CreatePostController } from "./controllers/create-post.controller";
import { FetchUserPostsController } from "./controllers/fetch-user-posts.controller";
import { FetchPostsController } from "./controllers/fetch-all-posts.controller";
import { EditProfilePhotoController } from "./controllers/edit-profile-photo.controller";
import { DeletePostController } from "./controllers/delete-post.controller";
import { EditPostDescriptionController } from "./controllers/edit-post-description.controller";
import { FetchUsersController } from "./controllers/fetch-users.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreatePostController,
    FetchUserPostsController,
    FetchPostsController,
    EditProfilePhotoController,
    DeletePostController,
    EditPostDescriptionController,
    FetchUsersController,
  ],
  providers: [PrismaService],
})
export class AppModule {}
