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
} from '@nestjs/common';
import { UsersService } from './user.service';
import { Role } from '../enums/role.enum';
import { Roles } from '../enums/roles.decorator';
import { RolesGuard } from '../enums/roles.guard';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() body: any) {
    return this.usersService.create(body);
  }
  
  @Get('unsubscribe/:token')
  unsubscribe(@Param('token') token: string) {
    return this.usersService.unsubscribe(token);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  @Roles(Role.Admin, Role.User)
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Put(':id')
  @Roles(Role.Admin)
  update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.usersService.update(id, body);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
