import * as livekit from 'livekit-server-sdk';
import { AppEnvironmentService } from '@livekit-demo/common';
import { Injectable } from '@nestjs/common';
@Injectable()
export class LivekitService {
  protected roomService: livekit.RoomServiceClient;

  constructor(protected readonly envService: AppEnvironmentService) {
    this.roomService = new livekit.RoomServiceClient(
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
    const at = new livekit.AccessToken(
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
    const at = new livekit.AccessToken(
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

    const token = await at.toJwt();
    return { token };
  }

  async leftRoom(roomCode: string, userCode: string) {
    await this.roomService.removeParticipant(roomCode, userCode);
  }

  async bannedParticipant(roomCode: string, userCode: string) {
    await this.roomService.removeParticipant(roomCode, userCode);
  }

  async participantTrackController(roomCode: string, userCode: string, isMute = true) {
    await this.roomService.mutePublishedTrack(roomCode, userCode, 'track_sid', isMute);
  }
}
