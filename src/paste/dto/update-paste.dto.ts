import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePasteDto {
  @ApiPropertyOptional({ example: 'Updated text content.' })
  content?: string;
}
