import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserModelModule } from './repository/user.model.module';
import { UserService } from './user.service';

@Module({
  imports: [UserModelModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
