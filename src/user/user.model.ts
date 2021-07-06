import { Column, DataType, Model, Table } from "sequelize-typescript";

import { IUserCreateDto } from "./interfaces";
import { ns } from "../common/constants";
import { IBase } from "../common/base";

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  PENDING = "PENDING",
}

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface IUser extends IBase {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userStatus: UserStatus;
  userRole: UserRole;
}

@Table({
  schema: ns,
  tableName: "user",
  underscored: true,
  defaultScope: {
    attributes: {
      exclude: ["password"],
    },
  },
})
export class UserModel extends Model<IUser, IUserCreateDto> implements IUser {
  @Column({
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    type: DataType.UUID,
  })
  public id: string;

  @Column
  public firstName: string;

  @Column
  public lastName: string;

  @Column
  public email: string;

  @Column
  public password: string;

  @Column({
    type: DataType.ENUM({ values: Object.keys(UserStatus) }),
    defaultValue: UserStatus.PENDING,
  })
  public userStatus: UserStatus;

  @Column({
    type: DataType.ENUM({ values: Object.keys(UserRole) }),
    defaultValue: UserRole.USER,
  })
  public userRole: UserRole;

  @Column
  public createdAt: Date;

  @Column
  public updatedAt: Date;
}
