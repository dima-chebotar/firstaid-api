import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IGoogleUser } from '../interfaces/google-user.interface';

export const GoogleUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: IGoogleUser = request.user;

    return data ? user?.[data] : user;
  },
);
