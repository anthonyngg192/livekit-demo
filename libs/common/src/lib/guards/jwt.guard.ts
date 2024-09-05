import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserJWTAuthGuard extends AuthGuard('user-jwt') {}
