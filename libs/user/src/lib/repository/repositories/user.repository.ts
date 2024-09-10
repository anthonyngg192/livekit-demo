import * as nanoid from 'nanoid';
import moment from 'moment';
import { BaseRepository } from '@livekit-demo/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDoc, UserModel } from '../models/user.model';

@Injectable()
export class UserRepository extends BaseRepository<UserDoc, UserModel> {
  constructor(@InjectModel(UserModel.name) public override readonly model: Model<UserDoc>) {
    super(model);
  }

  async generateUserCode() {
    const currentDate = moment().format('DDMMYY').toString();
    const prefixCode = nanoid.random(10);

    return `${currentDate}${prefixCode}`;
  }
}
