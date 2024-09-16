import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDTO {
  @ApiProperty({
    example: 'tonydemo@gmail.com',
  })
  @IsString()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: 'Demodemo12',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  password!: string;
}
