import { LivekitService } from './services/livekit.service';
import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomModelModule } from './repository';
import { RoomService } from './services/room.service';
import { RoomWebhookController } from './hooks/room.webhook.controller';

@Module({
  imports: [RoomModelModule],
  controllers: [RoomController, RoomWebhookController],
  providers: [RoomService, LivekitService],
  exports: [RoomService, LivekitService],
})
export class RoomModule {}
