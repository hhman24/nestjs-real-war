import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthorizationGuard implements CanActivate {
  logger = new Logger(JwtAuthorizationGuard.name);
  canActivate(
    _: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // NOTICE: CONTROLLER GUARD
    this.logger.log('===TRIGGER CONTROLLER GUARD===');
    // IMPLEMENT JWT GUARD LOGIC HERE
    return true;
  }
}
