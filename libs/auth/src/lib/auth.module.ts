import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserJwtStrategy } from './strategies/user-jwt.strategy';
import { UserLocalStrategy } from './strategies/user-local.strategy';
import { UserModelModule } from '@livekit-demo/user';

@Module({
  imports: [UserModelModule, PassportModule],
  controllers: [AuthController],
  providers: [AuthService, UserLocalStrategy, UserJwtStrategy],
})
export class AuthModule {}
