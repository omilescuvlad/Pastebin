import { ApiProperty } from '@nestjs/swagger';

export class CreatePasteDto {
  @ApiProperty({ example: 'Text to share securely.' })
  content: string;

  @ApiProperty({ example: 1, minimum: 1 })
  userId: number;
}
