import { AccountModel, AccountSchema } from './models/account.model';
import { AccountRepository } from './repositories/account.repository';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from './models/user.model';
import { UserRepository } from './repositories/user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserModel.name, schema: UserSchema },
      { name: AccountModel.name, schema: AccountSchema },
    ]),
  ],
  providers: [UserRepository, AccountRepository],
  exports: [UserRepository, AccountRepository],
})
export class UserModelModule {}
