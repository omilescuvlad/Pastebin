import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PastesService } from './paste.service';
import { PastesController } from './paste.controller';
import { Paste } from './paste.entity';
import { User } from '../user/user.entity';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Paste]), 
    MailModule
  ],
  providers: [PastesService],
  controllers: [PastesController],
  exports: [PastesService],
})
export class PastesModule {}
