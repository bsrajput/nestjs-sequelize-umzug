import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

import { IUserCreateDto } from "../interfaces";
import { UserRole } from "../user.model";

export class UserCreateDto implements IUserCreateDto {
  @ApiProperty()
  @IsString()
  public firstName: string;

  @ApiProperty()
  @IsString()
  public lastName: string;

  @ApiProperty()
  @IsString()
  public email: string;

  @ApiProperty()
  @IsString()
  public password: string;

  // this field is not allowed
  public userRole: UserRole;
}
