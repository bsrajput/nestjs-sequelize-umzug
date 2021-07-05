import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import { IUser, UserModel } from "./user.model";
import { IUserCreateDto, IUserSearchDto, IUserUpdateDto } from "./interfaces";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel)
    private userModel: typeof UserModel,
  ) {}

  public search(dto: IUserSearchDto): Promise<{ rows: Array<UserModel>; count: number }> {
    void dto;
    return this.userModel.findAndCountAll();
  }

  public findOne(where: Partial<IUser>): Promise<UserModel | null> {
    return this.userModel.findOne({ where });
  }

  public findAll(where: Partial<IUser>): Promise<Array<UserModel>> {
    return this.userModel.findAll({
      where,
    });
  }

  public async create(dto: IUserCreateDto): Promise<UserModel> {
    let userModel = await this.findOne({ email: dto.email });

    if (userModel) {
      throw new ConflictException("Duplicate email");
    }

    userModel = await this.userModel.build(dto).save();

    return userModel;
  }

  public async update(where: Partial<IUser>, data: IUserUpdateDto): Promise<UserModel> {
    const userEntity = await this.findOne(where);

    if (!userEntity) {
      throw new NotFoundException("userNotFound");
    }

    Object.assign(userEntity, data);
    return userEntity.save();
  }

  public delete(where: Partial<IUser>): Promise<number> {
    return this.userModel.destroy({ where });
  }
}
