import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BannedParticipantDTO } from './dto/banned-user.dto';
import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { CreateRoomDTO } from './dto/create-room.dto';
import { GetRoomDTO } from './dto/get-room.dto';
import { PagingDTO, UserJWTAuthGuard } from '@livekit-demo/common';
import { RoomService } from './services/room.service';
import { UserTrackDTO } from './dto/user-track.dto';

@ApiBearerAuth()
@ApiTags('Room')
@UseGuards(UserJWTAuthGuard)
@Controller({
  path: 'room',
})
export class RoomController {
  constructor(protected readonly roomService: RoomService) {}

  @Post()
  async createRoom(@Req() req: any, @Body() dto: CreateRoomDTO) {
    return this.roomService.createRoom(dto, req.user);
  }

  @Post(':code/join')
  async joinRoom(@Req() req: any, @Param() param: GetRoomDTO) {
    return this.roomService.generateTokenJoinRoom(param.code, req.user);
  }

  @Post(':code/left')
  async leftRoom(@Req() req: any, @Param() param: GetRoomDTO) {
    return this.roomService.leftRoom(param.code, req.user);
  }

  @Post(':code/banned')
  async bandUser(@Req() req: any, @Param() param: GetRoomDTO, @Body() dto: BannedParticipantDTO) {
    return this.roomService.banUser(param.code, req.user, dto);
  }

  @Put(':code/user-track')
  async userTrack(@Req() req: any, @Param() param: GetRoomDTO, @Body() dto: UserTrackDTO) {
    return this.roomService.roomUseTrack(param.code, req.user, dto);
  }

  @Get()
  async paginate(@Req() req: any, @Query() query: PagingDTO) {
    return this.roomService.paginate(query, req.user);
  }
}
