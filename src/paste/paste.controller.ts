import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { PastesService } from './paste.service';

@Controller('pastes')
export class PastesController {
  constructor(private readonly pastesService: PastesService) {}

  // CREATE paste
  @Post()
  create(@Body() body: any) {
    return this.pastesService.create(body);
  }

  // READ all pastes
  @Get()
  findAll() {
    return this.pastesService.findAll();
  }

  // UPDATE paste by id
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
  ) {
    return this.pastesService.update(id, body);
  }

  // DELETE paste by id
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pastesService.remove(id);
  }
}