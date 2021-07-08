import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import { UserModel } from "./user.model";
import { generateUserCreateDto } from "../common/test";

@Injectable()
export class UserSeedService {
  constructor(
    @InjectModel(UserModel)
    private userModel: typeof UserModel,
  ) {}

  public async setup(): Promise<any> {
    const user1 = await this.userModel.build(generateUserCreateDto()).save();

    return {
      users: [user1],
    };
  }

  public async tearDown(): Promise<void> {
    await this.userModel.destroy({});
  }
}
