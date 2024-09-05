import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomModelModule } from './repository';
import { RoomService } from './room.service';

@Module({
  imports: [RoomModelModule],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
