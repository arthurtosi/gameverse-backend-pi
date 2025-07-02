import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { Env } from "./env";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,
  });

  const configService: ConfigService<Env, true> = app.get(ConfigService);

  app.enableCors({
    origin: "*",
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle("API - GameVerse")
    .setDescription("Documentação da API")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("swagger", app, document);

  const port = configService.get("PORT", { infer: true });

  await app.listen(port);
}

void bootstrap();
