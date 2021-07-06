import { ApiProperty } from "@nestjs/swagger";

import { reEmail } from "@trejgun/constants-regexp";
import { IsString } from "@trejgun/nest-js-validators";

import { IsEmail } from "../../common/validators";
import { ILoginDto } from "../interfaces";

export class LoginSchema implements ILoginDto {
  @ApiProperty()
  @IsEmail({
    regexp: reEmail,
  })
  public email: string;

  @ApiProperty()
  @IsString()
  public password: string;
}
