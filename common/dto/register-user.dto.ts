import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterUserDto {
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

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty({ default: true, required: false })
  @IsOptional()
  active = true;

  @ApiProperty()
  @IsString()
  country!: string;
}
