import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { UsersModule } from './user/user.module';
import { Paste } from './paste/paste.entity';
import { PastesModule } from './paste/paste.module';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';

import { UsersController } from './user/user.controller';
import { PastesController } from './paste/paste.controller';

//dotenv
dotenv.config();
@Module({
  imports: [ConfigModule.forRoot()],
})

//database connection
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, Paste],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UsersModule,
    PastesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}



