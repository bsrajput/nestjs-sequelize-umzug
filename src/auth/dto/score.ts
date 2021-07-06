import { ApiProperty } from "@nestjs/swagger";

import { IsString } from "@trejgun/nest-js-validators";

import { IPasswordScoreDto } from "../interfaces";

export class ValidatePasswordScoreSchema implements IPasswordScoreDto {
  @ApiProperty()
  @IsString()
  public password: string;
}
