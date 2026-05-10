
import { Module } from '@nestjs/common';
import { PastesModule } from './paste.module';
import { PastesService } from './paste.service';
import { PastesController } from './paste.controller';

@Module({
  imports: [PastesModule],
  providers: [PastesService],
  controllers: [PastesController]
})
export class PasteHttpModule {}
