import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { assignIn } from 'lodash';
import { BaseModel } from '@livekit-demo/common';
import { Document, SchemaTypes } from 'mongoose';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type MessageDoc = MessageModel & Document;

@Schema({ collection: 'messages', versionKey: false })
export class MessageModel extends BaseModel {
  @ApiProperty()
  @Prop({ type: SchemaTypes.ObjectId })
  conversationId!: string;

  @ApiProperty()
  @Prop({ type: String })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Prop({ type: String })
  gif?: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @Prop({ type: [String] })
  images?: string[];

  @ApiResponseProperty()
  @Prop({ type: SchemaTypes.ObjectId })
  ownerId!: string;

  constructor(dto = null) {
    super();
    assignIn(this, dto);
  }
}

export const MessageSchema = SchemaFactory.createForClass(MessageModel);
