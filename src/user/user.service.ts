import { ConflictException, Inject, Injectable, Logger, LoggerService, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import { IUser, UserModel, UserStatus } from "./user.model";
import { IUserCreateDto, IUserSearchDto, IUserUpdateDto } from "./interfaces";
import { IPasswordDto } from "../auth/interfaces";
import { createHash } from "crypto";
import { ConfigService } from "@nestjs/config";
import { WhereOptions } from "sequelize";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel)
    private userModel: typeof UserModel,
    private readonly configService: ConfigService,
    @Inject(Logger)
    private readonly loggerService: LoggerService,
  ) {}

  public search(dto: IUserSearchDto): Promise<{ rows: Array<UserModel>; count: number }> {
    void dto;
    return this.userModel.findAndCountAll();
  }

  public async getByCredentials(username: string, password: string): Promise<UserModel | null> {
    const hash = this.createPasswordHash(password);
    return this.findOne({
      email: username,
      password: hash,
    });
  }

  public findOne(where: WhereOptions<UserModel>): Promise<UserModel | null> {
    return this.userModel.findOne({ where });
  }

  public findAll(where: WhereOptions<UserModel>): Promise<Array<UserModel>> {
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

    this.loggerService.log(`New user registered with email ${dto.email}`);

    return userModel;
  }

  public activate(userModel: UserModel): Promise<UserModel> {
    userModel.userStatus = UserStatus.ACTIVE;
    return userModel.save();
  }

  public async update(where: Partial<IUser>, dto: Partial<IUserUpdateDto>): Promise<UserModel> {
    const userModel = await this.findOne(where);

    if (!userModel) {
      throw new NotFoundException("userNotFound");
    }

    Object.assign(userModel, dto);
    return userModel.save();
  }

  public updatePassword(userModel: UserModel, dto: IPasswordDto): Promise<UserModel> {
    userModel.password = this.createPasswordHash(dto.password);
    return userModel.save();
  }

  public delete(where: Partial<IUser>): Promise<number> {
    return this.userModel.destroy({ where });
  }

  public createPasswordHash(password: string): string {
    const passwordSecret = this.configService.get<string>("PASSWORD_SECRET", "keyboard_cat");
    return createHash("sha256").update(password).update(passwordSecret).digest("hex");
  }
}
