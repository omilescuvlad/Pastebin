import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Vlad Omilescu' })
  fullName?: string;

  @ApiPropertyOptional({ example: 'vlad' })
  username?: string;

  @ApiPropertyOptional({ example: 'new-strong-password', format: 'password' })
  password?: string;

  @ApiPropertyOptional({ example: 'vlad@example.com', format: 'email' })
  email?: string;
}
