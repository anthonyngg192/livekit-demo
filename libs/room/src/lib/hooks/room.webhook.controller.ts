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

    let data = '';
    req.on('data', (chunk) => {
      console.log(chunk);
      data += chunk;
    });
    console.log(data);

    return this.livekitService.testing(dto, jwt);
  }
}
