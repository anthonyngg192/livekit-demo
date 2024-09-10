import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class ParticipantModel {
  @ApiProperty()
  @Prop({ type: String, required: true })
  code!: string;

  @ApiProperty()
  @Prop()
  isMute!: boolean;
}

export const ParticipantSchema = SchemaFactory.createForClass(ParticipantModel);
