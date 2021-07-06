import { Body, ClassSerializerInterceptor, Controller, HttpCode, Ip, Post, UseInterceptors } from "@nestjs/common";

import { Public } from "@trejgun/nest-js-providers";

import { UserCreateDto } from "../user/dto";
import { AuthService } from "./auth.service";
import {
  ForgotPasswordSchema,
  LoginSchema,
  LogoutSchema,
  RefreshSchema,
  ResendEmailVerificationSchema,
  RestorePasswordSchema,
  ValidatePasswordScoreSchema,
  VerifyEmailSchema,
} from "./dto";
import { IPasswordScoreResult } from "./interfaces";
import { IJwt } from "../common/jwt";

@Public()
@Controller("/auth")
export class AuthJwtController {
  constructor(private readonly authService: AuthService) {}

  @Post("/login")
  @HttpCode(200)
  public login(@Body() data: LoginSchema, @Ip() ip: string): Promise<IJwt> {
    return this.authService.login(data, ip);
  }

  @Post("/refresh")
  @HttpCode(200)
  async refreshToken(@Body() data: RefreshSchema, @Ip() ip: string): Promise<IJwt> {
    return this.authService.refresh(data, ip);
  }

  @Post("/logout")
  @HttpCode(204)
  public async logout(@Body() data: LogoutSchema): Promise<void> {
    await this.authService.logout(data);
  }

  @Post("/signup")
  @UseInterceptors(ClassSerializerInterceptor)
  public async signup(@Body() data: UserCreateDto, @Ip() ip: string): Promise<IJwt> {
    const userEntity = await this.authService.signup(data);
    return this.authService.loginUser(userEntity, ip);
  }

  @Post("/forgot-password")
  @HttpCode(204)
  public forgotPassword(@Body() data: ForgotPasswordSchema): Promise<void> {
    return this.authService.forgotPassword(data);
  }

  @Post("/restore-password")
  @HttpCode(204)
  public restorePassword(@Body() data: RestorePasswordSchema): Promise<void> {
    return this.authService.restorePassword(data);
  }

  @Post("/email-verification")
  @HttpCode(204)
  public emailVerification(@Body() data: VerifyEmailSchema): Promise<void> {
    return this.authService.emailVerification(data);
  }

  @Post("/resend-email-verification")
  @HttpCode(204)
  public resendEmailVerification(@Body() data: ResendEmailVerificationSchema): Promise<void> {
    return this.authService.resendEmailVerification(data);
  }

  @Post("/get-password-score")
  public getPasswordScore(@Body() data: ValidatePasswordScoreSchema): IPasswordScoreResult {
    return this.authService.getPasswordScore(data);
  }
}
