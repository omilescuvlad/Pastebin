import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({ example: 'vlad' })
  username: string;

  @ApiProperty({ example: 'strong-password', format: 'password' })
  password: string;
}
