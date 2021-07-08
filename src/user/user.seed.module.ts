import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";

import { UserSeedService } from "./user.seed.service";
import { UserModel } from "./user.model";

@Module({
  imports: [SequelizeModule.forFeature([UserModel])],
  providers: [UserSeedService],
  exports: [UserSeedService],
})
export class UserSeedModule {}
