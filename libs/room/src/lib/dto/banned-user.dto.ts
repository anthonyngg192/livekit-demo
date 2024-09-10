import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BannedParticipantDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userCode!: string;
}
