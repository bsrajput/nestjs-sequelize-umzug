import { ApiProperty } from "@nestjs/swagger";

import { IsString } from "@trejgun/nest-js-validators";

import { IRestorePasswordDto } from "../interfaces";
import { ValidatePasswordDto } from "./password";

export class RestorePasswordSchema extends ValidatePasswordDto implements IRestorePasswordDto {
  @ApiProperty()
  @IsString()
  public token: string;
}
