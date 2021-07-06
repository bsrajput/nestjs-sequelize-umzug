import { Column, DataType, Model, Table } from "sequelize-typescript";
import { Association } from "sequelize";
import { IBase } from "../common/base";
import { ITokenCreateDto } from "./interfaces";
import { UserModel } from "../user/user.model";
import { ns } from "../common/constants";

export enum TokenType {
  EMAIL = "EMAIL",
  PASSWORD = "PASSWORD",
}

export interface IToken extends IBase {
  id: string;
  tokenType: TokenType;
}

@Table({
  schema: ns,
  tableName: "token",
  underscored: true,
  defaultScope: {
    attributes: {
      exclude: ["ip"],
    },
  },
})
export class TokenModel extends Model<IToken, ITokenCreateDto> implements IToken {
  @Column({
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    type: DataType.UUID,
  })
  public id: string;

  @Column({
    type: DataType.ENUM({ values: Object.keys(TokenType) }),
    defaultValue: TokenType.EMAIL,
  })
  public tokenType: TokenType;

  @Column
  public createdAt: Date;

  @Column
  public updatedAt: Date;

  public readonly user: UserModel;

  public static associations: {
    user: Association<UserModel, TokenModel>;
  };
}

TokenModel.belongsTo(UserModel, { targetKey: "id" });
UserModel.hasMany(TokenModel, { sourceKey: "id" });
