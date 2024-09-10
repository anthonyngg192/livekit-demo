import { ApiProperty } from '@nestjs/swagger';
import { assignIn } from 'lodash';
import { BaseModel } from '@livekit-demo/common';
import { Document } from 'mongoose';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserStatus } from '../../constants/user.status';

export type UserDoc = UserModel & Document;

@Schema({ collection: 'users', versionKey: false })
export class UserModel extends BaseModel {
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
  @IsEnum(UserStatus)
  @Prop({ enum: UserStatus, type: String, default: UserStatus })
  status?: UserStatus;

  @Prop({ index: true })
  code!: string;

  @ApiProperty()
  @Prop({ type: [String], default: [] })
  blacklist!: string[];

  constructor(dto = null) {
    super();
    assignIn(this, dto);
  }
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
