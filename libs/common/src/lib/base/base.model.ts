import { ApiResponseProperty } from '@nestjs/swagger';
import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class BaseModel {
  @ApiResponseProperty()
  _id?: string;

  @ApiResponseProperty()
  @Prop({ type: Number, index: true })
  createdAt?: number;

  @ApiResponseProperty()
  @Prop({ type: Number, index: true })
  updatedAt?: number;
}
