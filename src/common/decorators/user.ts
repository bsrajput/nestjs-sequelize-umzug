import { createParamDecorator, ExecutionContext } from "@nestjs/common";

import { IUser } from "../../user/user.model";

export const User = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return (request.user as IUser) || null;
});
