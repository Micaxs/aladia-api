import { ApiProperty } from '@nestjs/swagger';

export class UserRto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  username!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  active!: boolean;

  @ApiProperty()
  country!: string;
}
