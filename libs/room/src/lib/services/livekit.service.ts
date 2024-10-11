import { AccessToken, RoomServiceClient, WebhookReceiver } from 'livekit-server-sdk';
import { AppEnvironmentService } from '@livekit-demo/common';
import { Injectable } from '@nestjs/common';
import { RoomRepository } from '../repository';
@Injectable()
export class LivekitService {
  private roomService: RoomServiceClient;

  constructor(protected readonly envService: AppEnvironmentService, private readonly roomRepo: RoomRepository) {
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

  async webhookReceive(_dto: any, _jwt: string) {
    const receiver = new WebhookReceiver(
      this.envService.ENVIRONMENT.LIVEKIT_API_KEY,
      this.envService.ENVIRONMENT.LIVEKIT_API_SECRET,
    );

    const event = receiver.receive(_dto, _jwt);

    const roomInfo = event.room;
    const participantInfo = event.participant;
    switch (event.event) {
      case 'room_started':
        await this.roomRepo.updateOne(
          {
            code: roomInfo?.name,
          },
          {
            roomStart: Date.now(),
          },
        );
        break;

      case 'participant_joined':
        await this.roomRepo.updateOne(
          { code: roomInfo?.name },
          { $addToSet: { participants: { code: participantInfo?.name, isMute: false } } },
        );
        break;

      case 'participant_left':
        this.roomRepo.updateOne(
          {
            code: roomInfo?.name,
          },
          { $pull: { participants: { code: participantInfo?.name } } },
        );
        break;

      case 'track_published':
        this.roomRepo.updateOne(
          { code: roomInfo?.name, 'participants.code': participantInfo?.name },
          { $set: { 'participants.$.isMute': true } },
        );
        break;

      case 'track_unpublished':
        this.roomRepo.updateOne(
          { code: roomInfo?.name, 'participants.code': participantInfo?.name },
          { $set: { 'participants.$.isMute': false } },
        );
        break;

      case 'room_finished':
        await this.roomRepo.updateOne(
          {
            code: roomInfo?.name,
          },
          {
            roomEnd: Date.now(),
          },
        );
        break;

      default:
        return;
    }

    return true;
  }
}
