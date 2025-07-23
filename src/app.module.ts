import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { ConfigModule } from "@nestjs/config";
import { envSchema } from "./env";
import { AuthModule } from "./auth/auth.module";
import { CreateAccountController } from "./controllers/user/create-account.controller";
import { AuthenticateController } from "./controllers/user/authenticate.controller";
import { GetMeController } from "./controllers/user/get-me.controller";
import { DeleteUserController } from "./controllers/user/delete-user-by-id.controller";
import { EditAccountController } from "./controllers/user/edit-user-by-id.controller";
import { GetAllUsersController } from "./controllers/user/get-all-users.controller";
import { EditMeController } from "./controllers/user/edit-me.controller";
import { DeleteMeController } from "./controllers/user/delete-me.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [
    // usuário
    AuthenticateController,
    CreateAccountController,
    DeleteMeController,
    DeleteUserController,
    EditAccountController,
    EditMeController,
    GetMeController,
    GetAllUsersController,

    // game
  ],
  providers: [PrismaService],
})
export class AppModule {}
