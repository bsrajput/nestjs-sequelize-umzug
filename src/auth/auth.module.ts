import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { SequelizeModule } from "@nestjs/sequelize";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { UserModule } from "../user/user.module";
import { TokenModule } from "../token/token.module";
import { AuthJwtController } from "./auth.jwt.controller";
import { AuthService } from "./auth.service";
import { UserModel } from "../user/user.model";
import { JwtLocalStrategy } from "./strategies";
import { emailServiceProvider } from "../common/providers";

@Module({
  imports: [
    SequelizeModule.forFeature([UserModel]),
    UserModule,
    TokenModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET_KEY", "keyboard_cat"),
      }),
    }),
    ConfigModule,
  ],
  controllers: [AuthJwtController],
  providers: [emailServiceProvider, AuthService, JwtLocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
