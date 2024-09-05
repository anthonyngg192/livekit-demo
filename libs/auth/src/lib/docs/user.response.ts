import { OmitType } from '@nestjs/swagger';
import { UserModel } from '@livekit-demo/user';

export class UserDocs extends OmitType(UserModel, ['password'] as const) {}
