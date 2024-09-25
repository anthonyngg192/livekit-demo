import { AccessToken, RoomServiceClient, WebhookReceiver } from 'livekit-server-sdk';
import { AppEnvironmentService } from '@livekit-demo/common';
import { Injectable } from '@nestjs/common';
@Injectable()
export class LivekitService {
  private roomService: RoomServiceClient;

  constructor(protected readonly envService: AppEnvironmentService) {
    this.roomService = new RoomServiceClient(
      this.envService.ENVIRONMENT.LIVEKIT_HOST,
      this.envService.ENVIRONMENT.LIVEKIT_API_KEY,
      this.envService.ENVIRONMENT.LIVEKIT_API_SECRET,
    );
  }

  async createRoom(roomCode: string, userCode: string) {
    const timeout = 86400;
    const opts = {
      name: roomCode,
      emptyTimeout: timeout,
      maxParticipants: 20,
    };
    await this.roomService.createRoom(opts);
    const at = new AccessToken(
      this.envService.ENVIRONMENT.LIVEKIT_API_KEY,
      this.envService.ENVIRONMENT.LIVEKIT_API_SECRET,
      { identity: userCode },
    );

    at.addGrant({
      roomJoin: true,
      room: roomCode,
      canPublish: true,
      canSubscribe: true,
    });
    const token = at.toJwt();
    return {
      token,
      timeout,
    };
  }

  async joinRoom(roomCode: string, userCode: string) {
    const at = new AccessToken(
      this.envService.ENVIRONMENT.LIVEKIT_API_KEY,
      this.envService.ENVIRONMENT.LIVEKIT_API_SECRET,
      { identity: userCode },
    );
    at.addGrant({
      roomJoin: true,
      room: roomCode,
      canPublish: true,
      canSubscribe: true,
    });

    const token = at.toJwt();
    console.log(token);
    return { token };
  }

  async leftRoom(roomCode: string, userCode: string) {
    await this.roomService.removeParticipant(roomCode, userCode);
  }

  async bannedParticipant(roomCode: string, userCode: string) {
    const res = await this.roomService.removeParticipant(roomCode, userCode);
    console.log(res);
  }

  async participantTrackController(roomCode: string, userCode: string, isMute = true) {
    await this.roomService.mutePublishedTrack(roomCode, userCode, 'track_sid', isMute);
  }

  async testing(dto: any) {
    const receiver = new WebhookReceiver(
      this.envService.ENVIRONMENT.LIVEKIT_API_KEY,
      this.envService.ENVIRONMENT.LIVEKIT_API_SECRET,
    );

    const event = receiver.receive(
      dto,
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2aWRlbyI6eyJyb29tSm9pbiI6dHJ1ZSwicm9vbSI6IjI1MDkyNGt5bzlhMXJrdGsiLCJjYW5QdWJsaXNoIjp0cnVlLCJjYW5TdWJzY3JpYmUiOnRydWV9LCJpYXQiOjE3MjcyNjA5NjYsIm5iZiI6MTcyNzI2MDk2NiwiZXhwIjoxNzI3MjgyNTY2LCJpc3MiOiJBUElHUEgzdWs3NkZueFIiLCJzdWIiOiIxNjA5MjRlMWhmbXpucWM3IiwianRpIjoiMTYwOTI0ZTFoZm16bnFjNyJ9.c3n0kJYFrV0SZyWjb8WyFzVRgylgPQFvPWw1IdYgdr4',
    );

    console.log(event);
  }
}
