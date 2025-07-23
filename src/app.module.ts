import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { CreateAccountController } from "./controllers/user/create-account.controller";
import { ConfigModule } from "@nestjs/config";
import { envSchema } from "./env";
import { AuthModule } from "./auth/auth.module";
import { AuthenticateController } from "./controllers/user/authenticate.controller";
import { MeController } from "./controllers/user/me.controller";
import { DeleteUserController } from "./controllers/user/delete-user.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [
    AuthenticateController,
    CreateAccountController,
    MeController,
    DeleteUserController,
  ],
  providers: [PrismaService],
})
export class AppModule {}
