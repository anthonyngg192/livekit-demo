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
}
