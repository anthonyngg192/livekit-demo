import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { SortType } from '../constants';
import { Type } from 'class-transformer';

export class QueryDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiPropertyOptional({ enum: SortType })
  @IsOptional()
  @IsEnum(SortType)
  sortType?: SortType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  createdAtFrom?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  createdAtTo?: number;

  [index: string]: any;

  fields?: string[];
}
