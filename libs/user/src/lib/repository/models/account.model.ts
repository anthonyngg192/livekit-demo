import { AccountStatus } from '../../constants/account.status';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { assignIn } from 'lodash';
import { BaseModel } from '@livekit-demo/common';
import { Document } from 'mongoose';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AccountDoc = AccountModel & Document;

@Schema({ collection: 'accounts', versionKey: false })
export class AccountModel extends BaseModel {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @Prop({ unique: true, index: true, lowercase: true })
  email!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Prop()
  password!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Prop()
  name!: string;

  @Prop()
  passwordUpdatedAt!: number;

  @ApiProperty()
  @IsOptional()
  @IsEnum(AccountStatus)
  @Prop({ enum: AccountStatus, type: String, default: AccountStatus })
  status?: AccountStatus;

  @ApiResponseProperty()
  @Prop()
  roles!: string[];

  constructor(dto = null) {
    super();
    assignIn(this, dto);
  }
}

export const AccountSchema = SchemaFactory.createForClass(AccountModel);
