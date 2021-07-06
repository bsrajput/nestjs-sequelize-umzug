import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { WhereOptions } from "sequelize";

import { TokenModel, TokenType } from "./token.model";
import { UserModel } from "../user/user.model";

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(TokenModel)
    private tokenModel: typeof TokenModel,
  ) {}

  public findOne(where: WhereOptions<TokenModel>): Promise<TokenModel | null> {
    return this.tokenModel.findOne({ where, include: [TokenModel.associations.user] });
  }

  public async getToken(tokenType: TokenType, userModel: UserModel): Promise<TokenModel> {
    // working around https://github.com/typeorm/typeorm/issues/1090
    const token = await this.findOne({
      tokenType,
      // TODO fix me
      // user: userModel,
    });

    if (token) {
      // update timestamps
      return token.save();
    } else {
      return this.tokenModel
        .build({
          tokenType,
          user: userModel,
        })
        .save();
    }
  }
}
