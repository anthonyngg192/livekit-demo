import { assignIn } from 'lodash';
import { Document } from 'mongoose';
import { LogModel } from './log.model';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ErrorLogDoc = Document;

@Schema({ collection: 'errorLogs', versionKey: false })
export class ErrorLogModel extends LogModel {
  @Prop({ type: Date, default: new Date() })
  override readonly time!: Date;

  constructor(dto = null) {
    super();
    assignIn(this, dto);
  }
}

export const ErrorLogSchema = SchemaFactory.createForClass(ErrorLogModel);
