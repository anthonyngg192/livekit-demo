import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomModel, RoomSchema } from './models/room.model';
import { RoomRepository } from './room.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: RoomModel.name, schema: RoomSchema }])],
  providers: [RoomRepository],
  exports: [RoomRepository],
})
export class RoomModelModule {}
