import { ExpressRequest } from '@app/types/expressRequest.interface';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';

// 'CanActivate' is a guard that checks if the user is authenticated, i.e. it tells if something is allowed to happen or not.
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<ExpressRequest>();

    // Check if the user is authenticated.
    if (request.user) {
      return true;
    }

    // If not authenticated, deny access.
    throw new HttpException(
      'You are not authorized to access this resource',
      HttpStatus.UNAUTHORIZED,
    );
  }
}
