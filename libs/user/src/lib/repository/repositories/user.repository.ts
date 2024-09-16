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

  async generateUserCode(): Promise<string> {
    const currentDate = moment().format('DDMMYY').toString();
    const preGenerate = nanoid.customAlphabet('1234567890qwertyuioplkjhgfdsazxcvbnm', 10);
    const prefixCode = preGenerate();
    const code = `${currentDate}${prefixCode}`;
    const condition = { code };
    const instance = await this.find(condition);
    return instance ? await this.generateUserCode() : code;
  }
}
