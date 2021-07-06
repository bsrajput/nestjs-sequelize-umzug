import { Module } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { WinstonModule } from "nest-winston";
import { WinstonConfigService } from "@trejgun/nest-js-module-winston";
import { HelmetModule } from "@trejgun/nest-js-module-helmet";
import { HttpValidationPipe } from "@trejgun/nest-js-providers";

import { AppController } from "./app.controller";
import { DatabaseModule } from "./database/database.module";
import { HealthModule } from "./health/health.module";
import { UserModule } from "./user/user.module";

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: HttpValidationPipe,
    },
  ],
  imports: [
    HelmetModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV as string}`,
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      useClass: WinstonConfigService,
    }),
    DatabaseModule,
    HealthModule,
    UserModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
