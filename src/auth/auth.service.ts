import { Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/sequelize";
import { WhereOptions } from "sequelize";
import { v4 } from "uuid";
import zxcvbn from "zxcvbn";

import { UserService } from "../user/user.service";
import {
  IEmailVerificationDto,
  IForgotPasswordDto,
  ILoginDto,
  IPasswordScoreDto,
  IPasswordScoreResult,
  IResendEmailVerificationDto,
  IRestorePasswordDto,
} from "./interfaces";
import { AuthModel } from "./auth.model";
import { IUserCreateDto } from "../user/interfaces";
import { TokenService } from "../token/token.service";
import { TokenType } from "../token/token.model";
import { IJwt } from "../common/jwt";
import { ProviderType } from "../common/constants/providers";
import { UserModel, UserStatus } from "../user/user.model";
import { EmailType } from "../common/email";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(AuthModel)
    private authModel: typeof AuthModel,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
    @Inject(ProviderType.EMAIL_SERVICE)
    private readonly emailClientProxy: ClientProxy,
  ) {}

  public async login(data: ILoginDto, ip: string): Promise<IJwt> {
    const userModel = await this.userService.getByCredentials(data.email, data.password);

    if (!userModel) {
      throw new UnauthorizedException("userNotFound");
    }

    return this.loginUser(userModel, ip);
  }

  public async logout(where: WhereOptions<AuthModel>): Promise<number> {
    return this.authModel.destroy({ where });
  }

  public async refresh(where: WhereOptions<AuthModel>, ip: string): Promise<IJwt> {
    const authModel = await this.authModel.findOne({ where, include: [AuthModel.associations.user] });

    if (!authModel || authModel.refreshTokenExpiresAt < new Date().getTime()) {
      throw new UnauthorizedException("refreshTokenHasExpired");
    }

    return this.loginUser(authModel.user, ip);
  }

  public async loginUser(userModel: UserModel, ip: string): Promise<IJwt> {
    const refreshToken = v4();
    const date = new Date();

    // it is actually a string
    const accessTokenExpiresIn = ~~this.configService.get<number>("JWT_ACCESS_TOKEN_EXPIRES_IN", 5 * 60);
    const refreshTokenExpiresIn = ~~this.configService.get<number>("JWT_REFRESH_TOKEN_EXPIRES_IN", 30 * 24 * 60 * 60);

    await this.authModel
      .build({
        user: userModel,
        refreshToken,
        refreshTokenExpiresAt: date.getTime() + refreshTokenExpiresIn * 1000,
        ip,
      })
      .save();

    return {
      accessToken: this.jwtService.sign({ email: userModel.email }, { expiresIn: accessTokenExpiresIn }),
      refreshToken: refreshToken,
      accessTokenExpiresAt: date.getTime() + accessTokenExpiresIn * 1000,
      refreshTokenExpiresAt: date.getTime() + refreshTokenExpiresIn * 1000,
    };
  }

  public async signup(data: IUserCreateDto): Promise<UserModel> {
    const userModel = await this.userService.create(data);

    const baseUrl = this.configService.get<string>("FE_URL", "http://localhost:8080");

    this.emailClientProxy.emit(EmailType.WELCOME, {
      user: userModel,
      baseUrl,
    });

    const tokenEntity = await this.tokenService.getToken(TokenType.EMAIL, userModel);

    this.emailClientProxy.emit(EmailType.EMAIL_VERIFICATION, {
      token: tokenEntity,
      user: userModel,
      baseUrl,
    });

    return userModel;
  }

  public async forgotPassword(data: IForgotPasswordDto): Promise<void> {
    const userModel = await this.userService.findOne({ email: data.email });

    if (!userModel) {
      // if user is not found - return positive status
      return;
    }

    if (userModel.userStatus !== UserStatus.ACTIVE) {
      throw new UnauthorizedException("userIsNotActive");
    }

    const tokenEntity = await this.tokenService.getToken(TokenType.PASSWORD, userModel);

    const baseUrl = this.configService.get<string>("FE_URL", "http://localhost:8080");

    this.emailClientProxy.emit(EmailType.FORGOT_PASSWORD, {
      token: tokenEntity,
      user: userModel,
      baseUrl,
    });
  }

  public async restorePassword(data: IRestorePasswordDto): Promise<void> {
    const tokenModel = await this.tokenService.findOne({ id: data.token, tokenType: TokenType.PASSWORD });

    if (!tokenModel) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.userService.updatePassword(tokenModel.user, data);

    const baseUrl = this.configService.get<string>("FE_URL", "http://localhost:8080");

    this.emailClientProxy.emit(EmailType.RESTORE_PASSWORD, {
      user: tokenModel.user,
      baseUrl,
    });

    // delete token from db
    await tokenModel.destroy();
  }

  public async emailVerification(data: IEmailVerificationDto): Promise<void> {
    const tokenEntity = await this.tokenService.findOne({ id: data.token, tokenType: TokenType.EMAIL });

    if (!tokenEntity) {
      throw new NotFoundException("tokenNotFound");
    }

    await this.userService.activate(tokenEntity.user);
    // delete token from db
    await tokenEntity.destroy();
  }

  public async resendEmailVerification(data: IResendEmailVerificationDto): Promise<void> {
    const userModel = await this.userService.findOne({ email: data.email });

    if (!userModel) {
      // if user is not found - return positive status
      return;
    }

    const tokenEntity = await this.tokenService.getToken(TokenType.EMAIL, userModel);

    const baseUrl = this.configService.get<string>("FE_URL", "http://localhost:8080");

    this.emailClientProxy.emit(EmailType.EMAIL_VERIFICATION, {
      token: tokenEntity,
      user: userModel,
      baseUrl,
    });
  }

  public getPasswordScore(data: IPasswordScoreDto): IPasswordScoreResult {
    const { score } = zxcvbn(data.password);
    return { score };
  }
}
