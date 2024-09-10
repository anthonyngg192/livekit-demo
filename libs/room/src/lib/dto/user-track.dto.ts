import { ApiProperty } from '@nestjs/swagger';
import { BannedParticipantDTO } from './banned-user.dto';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class UserTrackDTO extends BannedParticipantDTO {
  @ApiProperty({ type: Boolean })
  @IsNotEmpty()
  @Type(() => Boolean)
  @IsBoolean()
  isMute!: boolean;
}
