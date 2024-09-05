import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { QueryDTO } from './query.dto';
import { Type } from 'class-transformer';

export class PagingDTO extends QueryDTO {
  @ApiProperty({ required: true, default: 1 })
  @Type(() => Number)
  @IsDefined()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiProperty({ required: true, default: 20 })
  @Type(() => Number)
  @IsDefined()
  @IsNotEmpty()
  @IsInt()
  @Max(200)
  @Min(1)
  limit: number = 20;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fullTextSearch?: string;
}
