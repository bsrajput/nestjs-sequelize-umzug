import { Column, DataType, Model, Table } from "sequelize-typescript";

import { ITokenCreateDto } from "../token/interfaces";
import { ns } from "../common/constants";
import { UserModel } from "../user/user.model";
import { TokenModel } from "../token/token.model";
import { Association } from "sequelize";

export interface IAuth {
  refreshToken?: string;
  refreshTokenExpiresAt?: number;
}

@Table({
  schema: ns,
  tableName: "auth",
  underscored: true,
})
export class AuthModel extends Model<IAuth, ITokenCreateDto> implements IAuth {
  @Column({
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    type: DataType.UUID,
  })
  public refreshToken: string;

  @Column({
    type: DataType.BIGINT,
  })
  public refreshTokenExpiresAt: number;

  @Column
  public ip: string;

  public readonly user: UserModel;

  public static associations: {
    user: Association<UserModel, TokenModel>;
  };
}

AuthModel.belongsTo(UserModel, { targetKey: "id" });
UserModel.hasMany(TokenModel, { sourceKey: "id" });
