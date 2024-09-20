import { Body, Controller, Post } from '@nestjs/common';
import { LivekitService } from '../services/livekit.service';

@Controller({
  path: 'webhook-endpoint',
})
export class RoomWebhookController {
  constructor(private readonly livekitService: LivekitService) {}

  @Post()
  async test(@Body() dto: any) {
    return this.livekitService.testing(dto);
  }
}
