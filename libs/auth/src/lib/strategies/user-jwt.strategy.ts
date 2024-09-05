import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { PayloadDTO } from '../dto/payload.dto';
import { UserRepository, UserStatus } from '@livekit-demo/user';

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepo: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env['JWT_SECRET_KEY'],
    });
  }

  async validate(payload: PayloadDTO) {
    const user = await this.userRepo.findById(payload._id);
    if (!user) throw new UnauthorizedException();
    if (user.status === UserStatus.DeActive) throw new BadRequestException('Use was blocked');
    return user;
  }
}
