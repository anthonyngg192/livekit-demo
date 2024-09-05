import { assignIn } from 'lodash';
import { BaseModel } from '../../base';
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type LogDoc = Document & LogModel;

@Schema({ collection: 'logs', versionKey: false })
export class LogModel extends BaseModel {
  @Prop({ index: true })
  readonly url!: string;

  @Prop()
  readonly requestBody!: string;

  @Prop()
  readonly responseBody!: string;

  @Prop()
  readonly status!: number;

  @Prop()
  readonly method!: string;

  @Prop({ type: Date, default: new Date(), index: { expires: 432000 } })
  readonly time!: Date;

  @Prop()
  readonly header?: string;

  constructor(dto = null) {
    super();
    assignIn(this, dto);
  }
}

export const LogSchema = SchemaFactory.createForClass(LogModel);
