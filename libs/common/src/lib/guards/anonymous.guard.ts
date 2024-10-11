import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { IS_ANONYMOUS } from '../decorators';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AnonymousGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  override canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    const isAnonymous = this.reflector.get(IS_ANONYMOUS, context.getHandler());
    if (isAnonymous && !token) {
      return true;
    }

    return super.canActivate(context);
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
