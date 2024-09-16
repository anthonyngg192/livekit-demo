import * as nanoid from 'nanoid';
import moment from 'moment';
import { BaseRepository } from '@livekit-demo/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoomDoc, RoomModel } from './models/room.model';

@Injectable()
export class RoomRepository extends BaseRepository<RoomDoc, RoomModel> {
  constructor(@InjectModel(RoomModel.name) public override readonly model: Model<RoomDoc>) {
    super(model);
  }

  async generateRoomCode(): Promise<string> {
    const currentDate = moment().format('DDMMYY').toString();
    const preGenerate = nanoid.customAlphabet('1234567890qwertyuioplkjhgfdsazxcvbnm', 10);
    const prefixCode = preGenerate();
    const code = `${currentDate}${prefixCode}`;
    const condition = { code };
    const instance = await this.find(condition);
    return instance ? await this.generateRoomCode() : code;
  }
}
