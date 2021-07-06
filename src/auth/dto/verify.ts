import { ApiProperty } from "@nestjs/swagger";

import { IsString } from "@trejgun/nest-js-validators";

import { IEmailVerificationDto } from "../interfaces";

export class VerifyEmailSchema implements IEmailVerificationDto {
  @ApiProperty()
  @IsString()
  public token: string;
}
