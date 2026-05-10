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
import { UsersService } from './user.service';

@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() body: any) {
    return this.usersService.create(body);
  }
  
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
  ) {
    return this.usersService.update(id, body);
  }
  
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
