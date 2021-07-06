import { IUserCreateDto } from "./create";
import { UserStatus } from "../user.model";

export interface IUserImportDto extends IUserCreateDto {
  userStatus: UserStatus;
}
