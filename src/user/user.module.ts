import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './user.service';
import { User } from './user.entity';
import { UsersController } from './user.controller';
import { Paste } from '../paste/paste.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Paste, User])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
