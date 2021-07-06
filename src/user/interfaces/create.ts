import { UserRole } from "../user.model";

export interface IUserCreateDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userRole: UserRole;
}
