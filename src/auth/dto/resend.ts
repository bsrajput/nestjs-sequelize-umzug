import { ApiProperty } from "@nestjs/swagger";

import { reEmail } from "@trejgun/constants-regexp";

import { ReCaptcha, IsEmail } from "../../common/validators";
import { IResendEmailVerificationDto } from "../interfaces";

export class ResendEmailVerificationSchema implements IResendEmailVerificationDto {
  @ApiProperty()
  @IsEmail({
    regexp: reEmail,
  })
  public email: string;

  // TODO FIX ME, should be required
  @ApiProperty()
  @ReCaptcha({
    required: false,
  })
  public captcha: string;
}
