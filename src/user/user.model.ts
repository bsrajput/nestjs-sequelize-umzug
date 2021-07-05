import { Column, Model, Table, DataType } from "sequelize-typescript";

import { IUserCreateDto } from "./interfaces";
import { ns } from "../common/constants";

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

@Table({
  schema: ns,
  tableName: "user",
  underscored: true,
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

  @Column
  public createdAt: Date;

  @Column
  public updatedAt: Date;
}
