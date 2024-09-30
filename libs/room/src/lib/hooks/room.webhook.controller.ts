import { Body, Controller, Post, Req } from '@nestjs/common';
import { LivekitService } from '../services/livekit.service';

@Controller({
  path: 'webhook-endpoint',
})
export class RoomWebhookController {
  constructor(private readonly livekitService: LivekitService) {}

  @Post()
  async test(@Req() req: any, @Body() _dto: any) {
    const jwt = req.headers['authorization'];
    req.setEncoding('utf8');
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });

    req.on('end', () => {
      this.livekitService.testing(data, jwt);
    });

    return true;
  }
}
