import { Users } from '@app/user/user.entity';
import { Request } from 'express';

export interface ExpressRequest extends Request {
  user?: Users;
}
