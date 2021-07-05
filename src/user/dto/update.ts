import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

import { IUserUpdateDto } from "../interfaces";
import { UserCreateDto } from "./create";

export class UserUpdateDto extends UserCreateDto implements IUserUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastName: string;
}
