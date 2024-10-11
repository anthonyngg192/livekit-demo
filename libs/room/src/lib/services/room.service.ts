import { ApiError, PagingDTO } from '@livekit-demo/common';
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { BannedParticipantDTO } from '../dto/banned-user.dto';
import { CreateRoomDTO } from '../dto/create-room.dto';
import { InviteParticipantDTO } from '../dto/invite-user.dto';
import { LivekitService } from './livekit.service';
import { RoomRepository } from '../repository';
import { RoomStatus } from '../constants/room.status';
import { RoomType } from '../constants/room.type';
import { UserModel } from '@livekit-demo/user';
import { UserTrackDTO } from '../dto/user-track.dto';

@Injectable()
export class RoomService {
  constructor(private readonly livekitService: LivekitService, private readonly roomRepo: RoomRepository) {}

  async createRoom(dto: CreateRoomDTO, user: UserModel) {
    const roomCode = await this.roomRepo.generateRoomCode();

    const result = await this.livekitService.createRoom(roomCode, user.code);
    if (!result.token) throw new InternalServerErrorException(ApiError.SomethingWentWrong);

    await this.roomRepo.insert({
      ownerCode: user.code,
      blacklist: [...user.blacklist],
      participants: [{ code: user.code, isMute: false }],
      code: roomCode,
      type: dto.type,
      displayName: dto.displayName,
      status: RoomStatus.Stated,
      expiredAt: Date.now() + result.timeout,
    });

    return { token: result.token };
  }

  async generateTokenJoinRoom(roomCode: string, user: UserModel) {
    const room = await this.roomRepo.find({ code: roomCode });
    if (!room) throw new BadRequestException(ApiError.RoomNotFound);
    if (room.blacklist.some((x) => x === user.code)) throw new BadRequestException(ApiError.YouCanNotAccessToThisRoom);

    if (room.type === RoomType.Private && !room.participants.some((x) => x.code === user.code))
      throw new BadRequestException(ApiError.YouCanNotAccessToThisRoom);

    const result = await this.livekitService.joinRoom(roomCode, user.code);
    if (!result.token) throw new InternalServerErrorException(ApiError.SomethingWentWrong);
    return { token: result.token };
  }

  async leftRoom(roomCode: string, user: UserModel) {
    const room = await this.roomRepo.find({ code: roomCode });
    if (!room) throw new BadRequestException(ApiError.RoomNotFound);
    if (room.blacklist.some((x) => x === user.code)) throw new BadRequestException(ApiError.YouCanNotAccessToThisRoom);
    if (room.participants.some((x) => x.code === user.code)) throw new BadRequestException(ApiError.YouAreNotInRoom);
    await this.livekitService.leftRoom(roomCode, user.code);
    return true;
  }

  async banUser(roomCode: string, user: UserModel, dto: BannedParticipantDTO) {
    const room = await this.roomRepo.find({ code: roomCode });
    if (!room) throw new BadRequestException(ApiError.RoomNotFound);
    if (room.ownerCode !== user.code) throw new BadRequestException(ApiError.RoomPermission);
    if (room.blacklist.some((x) => x === dto.userCode))
      throw new BadRequestException(ApiError.UserAlreadyBannedFromThisRoom);
    if (room.ownerCode === dto.userCode) throw new BadRequestException(ApiError.YouCanNotBanYourSelf);
    await Promise.all([this.roomRepo.updateOne({ code: room.code }, { $addToSet: { blacklist: dto.userCode } })]);
    return true;
  }

  async inviteUser(roomCode: string, user: UserModel, dto: InviteParticipantDTO) {
    const room = await this.roomRepo.find({ code: roomCode });
    if (!room) throw new BadRequestException(ApiError.RoomNotFound);
    if (room.blacklist.some((x) => x === user.code)) throw new BadRequestException(ApiError.YouCanNotAccessToThisRoom);
    if (room.participants.some((x) => x.code === user.code)) throw new BadRequestException(ApiError.YouAreNotInRoom);

    if (room.type === RoomType.Private && room.ownerCode !== user.code)
      throw new BadRequestException(ApiError.RoomPermission);

    //TODO: send Invitation
    this.roomRepo.updateOne({ code: room.code }, { $addToSet: { participants: dto.userCode } });
    return true;
  }

  async roomUseTrack(roomCode: string, user: UserModel, dto: UserTrackDTO) {
    const room = await this.roomRepo.find({ code: roomCode });
    if (!room) throw new BadRequestException(ApiError.RoomNotFound);
    if (room.ownerCode !== user.code) throw new BadRequestException(ApiError.RoomPermission);
    if (room.blacklist.some((x) => x === dto.userCode))
      throw new BadRequestException(ApiError.UserAlreadyBannedFromThisRoom);
    if (room.participants.some((x) => x.code === user.code)) throw new BadRequestException(ApiError.YouAreNotInRoom);

    await Promise.all([this.livekitService.participantTrackController(room.code, dto.userCode, dto.isMute)]);
    return true;
  }

  async paginate(query: PagingDTO, user: UserModel) {
    const remakeQuery = {
      ...query,
      blacklist: { $ne: user.code },
    };

    return this.roomRepo.paginateAggregate(remakeQuery, [
      {
        $lookup: {
          from: 'users',
          localField: 'participants',
          foreignField: 'code',
          as: 'participantsDetail',
          pipeline: [
            {
              $project: {
                name: 1,
              },
            },
          ],
        },
      },
    ]);
  }
}
