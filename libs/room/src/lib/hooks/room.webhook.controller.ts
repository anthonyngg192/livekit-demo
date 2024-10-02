import { Controller, Post, Req } from '@nestjs/common';
import { LivekitService } from '../services/livekit.service';

@Controller({
  path: 'webhook-endpoint',
})
export class RoomWebhookController {
  constructor(private readonly livekitService: LivekitService) {}

  @Post()
  async receive(@Req() req: any) {
    const jwt = req.headers['authorization'];
    req.setEncoding('utf8');
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });

    req.on('end', () => {
      this.livekitService.webhookReceive(data, jwt);
    });

    return true;
  }
}
