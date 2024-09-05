import { BaseModel } from '@livekit-demo/common';
import { Document } from 'mongoose';
import { Schema, SchemaFactory } from '@nestjs/mongoose';

export type RoomDoc = RoomModel & Document;

@Schema({ collection: 'rooms', versionKey: false })
export class RoomModel extends BaseModel {}

export const RoomSchema = SchemaFactory.createForClass(RoomModel);
