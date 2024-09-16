import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { assignIn } from 'lodash';
import { BaseModel } from '@livekit-demo/common';
import { Document } from 'mongoose';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ParticipantModel, ParticipantSchema } from './participant.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RoomStatus } from '../../constants/room.status';
import { RoomType } from '../../constants/room.type';

export type RoomDoc = RoomModel & Document;

@Schema({ collection: 'rooms', versionKey: false })
export class RoomModel extends BaseModel {
  @ApiProperty({ required: true })
  @Prop({ type: String })
  ownerCode!: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @Prop({ type: [String] })
  blacklist!: string[];

  @ApiProperty({ type: [ParticipantModel] })
  @IsOptional()
  @IsArray()
  @Prop({ type: [ParticipantSchema] })
  participants!: ParticipantModel[];

  @ApiResponseProperty()
  @Prop({ unique: true, index: 'text' })
  code!: string;

  @ApiProperty({ enum: RoomType })
  @IsEnum(RoomType)
  @IsOptional()
  @Prop({ type: String, index: 'text' })
  type!: RoomType;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Prop()
  expiredAt!: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Prop()
  displayName!: string;

  @ApiResponseProperty()
  @Prop({ type: String })
  status!: RoomStatus;

  constructor(dto = null) {
    super();
    assignIn(this, dto);
  }
}

export const RoomSchema = SchemaFactory.createForClass(RoomModel);
