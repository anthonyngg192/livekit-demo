import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ApiOkModelResponse, UserJWTAuthGuard, UserLocalAuthGuard } from '@livekit-demo/common';
import { AuthService } from './auth.service';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { LoginDTO } from './dto/login.dto';
import { SuccessLoginDocs } from './docs/success-login.docs';
import { UserDocs } from './docs/user.response';

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
  async login(@Req() req, @Body() _dto: LoginDTO) {
    return this.authService.successLogin(req.user);
  }

  @ApiExtraModels(UserDocs)
  @ApiOkModelResponse({
    type: UserDocs,
  })
  @ApiBearerAuth()
  @UseGuards(UserJWTAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return this.authService.getProfile(req.user);
  }
}
