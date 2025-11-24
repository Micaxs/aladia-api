import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  username!: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  password!: string;
}
