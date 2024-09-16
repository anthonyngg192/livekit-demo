import * as bcrypt from 'bcrypt';
import * as nanoid from 'nanoid';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { omit } from 'lodash';
import { SignUpDto } from './dto/sign-up.dto';
import { UserModel, UserRepository, UserStatus } from '@livekit-demo/user';

@Injectable()
export class AuthService {
  constructor(private readonly userRepo: UserRepository, private readonly jwtService: JwtService) {}

  async validateUser(email: string, password: string) {
    const user = await this.userRepo.findOne({ email });
    if (!user) throw new BadRequestException('Email does not existed');
    if (user.status === UserStatus.DeActive) throw new BadRequestException('Account was blocked');

    if (await bcrypt.compare(password, user.password)) return omit(user, ['password']);

    throw new UnauthorizedException('Invalid Password');
  }

  successLogin(user: UserModel) {
    const payload = omit(user, ['password']);
    return {
      accessToken: this.jwtService.sign(payload),
      profile: payload,
    };
  }

  getProfile(user: UserModel) {
    return omit(user, ['password']);
  }

  test() {
    console.log(nanoid.nanoid(20));
  }

  async register(dto: SignUpDto) {
    const rePassword = await bcrypt.hashSync(dto.password, 10);
    const code = await this.userRepo.generateUserCode();
    const newUser = await this.userRepo.insert({
      email: dto.email,
      password: rePassword,
      passwordUpdatedAt: Date.now(),
      status: UserStatus.Active,
      name: dto.name,
      code,
      blacklist: [],
    });
    if (!newUser) throw new BadRequestException();
    return {
      accessToken: this.jwtService.sign(omit(newUser, ['password'])),
      profile: omit(newUser, ['password']),
    };
  }
}
