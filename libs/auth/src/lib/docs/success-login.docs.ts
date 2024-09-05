import { ApiResponseProperty } from '@nestjs/swagger';
import { UserModel } from '@livekit-demo/user';

export class SuccessLoginDocs {
  @ApiResponseProperty()
  accessToken!: string;

  @ApiResponseProperty({ type: UserModel })
  profile!: UserModel;
}
