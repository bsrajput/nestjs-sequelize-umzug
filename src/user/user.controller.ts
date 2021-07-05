import { Body, Controller, Delete, Get, HttpCode, Param, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { NotFoundInterceptor, Public } from "@trejgun/nest-js-providers";

import { UserService } from "./user.service";
import { UserSearchDto, UserUpdateDto } from "./dto";
import { UserModel } from "./user.model";

@Public()
@ApiBearerAuth()
@Controller("/user")
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get("/")
  public search(@Query() query: UserSearchDto): Promise<{ rows: Array<UserModel>; count: number }> {
    return this.userService.search(query);
  }

  @Put("/:id")
  public update(@Param("id") id: string, @Body() body: UserUpdateDto): Promise<UserModel> {
    return this.userService.update({ id }, body);
  }

  @Get("/:id")
  @UseInterceptors(NotFoundInterceptor)
  public findOne(@Param("id") id: string): Promise<UserModel | null> {
    return this.userService.findOne({ id });
  }

  @Delete("/:id")
  @HttpCode(204)
  public async delete(@Param("id") id: string): Promise<void> {
    await this.userService.delete({ id });
  }
}
