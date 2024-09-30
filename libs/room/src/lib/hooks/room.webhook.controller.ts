import { Body, Controller, Post, Req } from '@nestjs/common';
import { LivekitService } from '../services/livekit.service';

@Controller({
  path: 'webhook-endpoint',
})
export class RoomWebhookController {
  constructor(private readonly livekitService: LivekitService) {}

  @Post()
  async test(@Req() req: any, @Body() dto: any) {
    const jwt = req.headers['authorization'];
    console.log('HEADER: ', req.headers);
    console.log('rawBody: ', req.rawBody);
    return this.livekitService.testing(dto, jwt);
  }
}
