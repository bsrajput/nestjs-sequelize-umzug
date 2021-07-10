import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const configService = app.get(ConfigService);

  const baseUrl = configService.get<string>("FE_URL", "http://localhost:8080");

  app.enableCors({
    origin:
      process.env.NODE_ENV === "development"
        ? [`http://localhost:8080`, `http://127.0.0.1:8080`, `http://0.0.0.0:8080`]
        : [baseUrl],
    credentials: true,
    exposedHeaders: ["Content-Disposition"],
  });

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle("nestjs-sequelize-umzug")
    .setDescription("API description")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("swagger", app, document);

  const host = configService.get<string>("HOST", "localhost");
  const port = configService.get<number>("PORT", 3000);

  await app.listen(port, host, () => {
    console.info(`API server is running on http://${host}:${port}`);
  });
}

void bootstrap();
