import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { UserService } from "../../user/user.service";
import { UserModel, UserStatus } from "../../user/user.model";

@Injectable()
export class JwtLocalStrategy extends PassportStrategy(Strategy, "jwt-http") {
  constructor(private readonly userService: UserService, private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken()]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET_KEY", "keyboard_cat"),
    });
  }

  public async validate(payload: { email: string }): Promise<UserModel> {
    const UserModel = await this.userService.findOne({ email: payload.email });

    if (!UserModel) {
      throw new UnauthorizedException("userNotFound");
    }

    if (UserModel.userStatus !== UserStatus.ACTIVE) {
      throw new UnauthorizedException("userIsNotActive");
    }

    return UserModel;
  }
}
