import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { SuccessLoginDocs } from './docs/success-login.docs';
import { UserDocs } from './docs/user.response';
import {
  AnonymousGuard,
  ApiOkModelResponse,
  IsPublic,
  UserJWTAuthGuard,
  UserLocalAuthGuard,
} from '@livekit-demo/common';

@ApiTags('Auth')
@Controller({
  path: '/auth',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiExtraModels(SuccessLoginDocs)
  @ApiOkModelResponse({
    type: SuccessLoginDocs,
  })
  @UseGuards(UserLocalAuthGuard)
  @Post('login')
  async login(@Req() req: any, @Body() _dto: LoginDTO) {
    return this.authService.successLogin(req.user);
  }

  @ApiExtraModels(UserDocs)
  @ApiOkModelResponse({
    type: UserDocs,
  })
  @ApiBearerAuth()
  @UseGuards(UserJWTAuthGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    return this.authService.getProfile(req.user);
  }

  @ApiExtraModels(SuccessLoginDocs)
  @ApiOkModelResponse({
    type: SuccessLoginDocs,
  })
  @Post('sign-up')
  async signUp(@Body() dto: SignUpDto) {
    return this.authService.register(dto);
  }

  @ApiBearerAuth()
  @UseGuards(AnonymousGuard)
  @IsPublic()
  @Post('test')
  async test(@Req() req: any) {
    if (req.user) {
      console.log(req.user);
    }
    return true;
  }
}
