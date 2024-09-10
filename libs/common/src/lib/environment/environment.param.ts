import { ExecutionEnvironment } from '../constants';
import { Expose, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsString } from 'class-validator';

Reflect;
export class AppEnvironmentParam {
  @IsNumber()
  @Type(() => Number)
  @Expose()
  API_PORT!: number;

  @IsString()
  @Type(() => String)
  @Expose()
  public APP_NAME!: string;

  @IsNumber()
  @Type(() => Number)
  @Expose()
  public HASH_ROUND!: number;

  @IsString()
  @Type(() => String)
  @IsEnum(ExecutionEnvironment)
  @Expose()
  public EXECUTION_ENVIRONMENT = ExecutionEnvironment.Develop;

  @IsString()
  @Type(() => String)
  @Expose()
  public DB_CONNECTION_STRING!: string;

  @IsString()
  @Type(() => String)
  @Expose()
  public JWT_SECRET_KEY!: string;

  @IsString()
  @Type(() => String)
  @Expose()
  public LIVEKIT_API_KEY!: string;

  @IsString()
  @Type(() => String)
  @Expose()
  public LIVEKIT_API_SECRET!: string;

  @IsString()
  @Type(() => String)
  @Expose()
  public LIVEKIT_HOST!: string;
}
