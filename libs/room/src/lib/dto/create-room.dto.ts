import { PickType } from '@nestjs/swagger';
import { RoomModel } from '../repository';

export class CreateRoomDTO extends PickType(RoomModel, ['displayName', 'type'] as const) {}
