import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserLocalAuthGuard extends AuthGuard('local') {}
