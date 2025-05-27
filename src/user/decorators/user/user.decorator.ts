/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * createParamDecorator is a function that allows you to create custom decorators in NestJS.
 * ExecutionContext provides information about the current request and response cycle.
 */
export const User = createParamDecorator((data: any, ctx: ExecutionContext) => {
  // ctx is the execution context that provides information about the current request.
  const request = ctx.switchToHttp().getRequest();

  if (!request.user) {
    return null;
  }

  if (data) {
    return request.user[data];
  }

  return request.user;
});
