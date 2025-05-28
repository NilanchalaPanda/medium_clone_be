import { ExpressRequest } from '@app/types/expressRequest.interface';
import { UserService } from '@app/user/user.service';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
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
      const decoded = verify(token, 'topsecretkey') as {
        [key: string]: any;
      };
      const userId = Number(decoded.id);
      if (isNaN(userId)) {
        req.user = undefined;
        return next(new Error('Invalid user id in token'));
      }
      const user = await this.userService.findUserById(userId);
      req.user = user === null ? undefined : user;
    } catch (error: any) {
      req.user = undefined;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.name === 'TokenExpiredError') {
        return next(
          new HttpException('JWT token has expired', HttpStatus.UNAUTHORIZED),
        );
      }
      return next(error);
    }

    next();
  }
}
