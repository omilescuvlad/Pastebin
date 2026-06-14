import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  StreamableFile,
  Res,
} from '@nestjs/common';
import { PastesService } from './paste.service';
import { Roles } from '../enums/roles.decorator';
import { Role } from '../enums/role.enum';
import { RolesGuard } from '../enums/roles.guard';
import { AuthGuard } from '../auth/auth.guard';
import type { Response } from 'express';
import { CreatePasteDto } from './dto/create-paste.dto';
import { UpdatePasteDto } from './dto/update-paste.dto';

@Controller('pastes')
export class PastesController {
  constructor(private readonly pastesService: PastesService) {}

  // CREATE paste
  @Post()
  create(@Body() body: CreatePasteDto) {
    return this.pastesService.create(body);
  }

  // READ all pastes
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  @Roles(Role.Admin)
  findAll() {
    return this.pastesService.findAll();
  }

  // UPDATE paste by id
  @UseGuards(AuthGuard, RolesGuard)
  @Put(':id')
  @Roles(Role.Admin, Role.User)
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdatePasteDto) {
    return this.pastesService.update(id, body);
  }

  // DELETE paste by id
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(Role.Admin, Role.User)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pastesService.remove(id);
  }

  //DOWNLOAD paste content as file
  @Get(':id/download')
  async download(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const paste = await this.pastesService.findOne(id);

    const file = Buffer.from(paste.content, 'utf-8');

    res.set({
      'Content-Type': 'text/plain',
      'Content-Disposition': `attachment; filename="paste-${paste.id}.txt"`,
    });

    return new StreamableFile(file);
  }
}
