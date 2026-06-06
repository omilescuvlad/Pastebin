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
} from '@nestjs/common';
import { PastesService } from './paste.service';
import { Roles } from 'src/enums/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RolesGuard } from 'src/enums/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('pastes')
export class PastesController {
  constructor(private readonly pastesService: PastesService) {}

  // CREATE paste
  @Post()
  create(@Body() body: any) {
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
  update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
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
  @UseGuards(AuthGuard, RolesGuard)
  @Get(':id/download')
  @Roles(Role.Admin, Role.User)
  async download(@Param('id', ParseIntPipe) id: number) {
    const paste = await this.pastesService.findOne(id);
    const file = Buffer.from(paste.content, 'utf-8');
    return new StreamableFile(file);
  }
}
