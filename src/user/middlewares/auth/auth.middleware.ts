import { ExpressRequest } from '@app/types/expressRequest.interface';
import { UserService } from '@app/user/user.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: ExpressRequest, _: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = undefined;
      return next();
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const decoded = verify(token, 'topsecretkey') as {
        [key: string]: any;
      };
      const user = await this.userService.findUserById(decoded.id);
      req.user = user === null ? undefined : user;
    } catch (error) {
      req.user = undefined;
      return next(error);
    }

    next();
  }
}
