import { Controller, Get } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('System')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiOperation({ summary: 'Check API and database readiness' })
  @ApiOkResponse({
    description: 'The API is running and PostgreSQL is reachable.',
    schema: { example: { status: 'ok', database: 'up' } },
  })
  @ApiServiceUnavailableResponse({
    description: 'The API is running, but PostgreSQL is unavailable.',
    schema: { example: { status: 'error', database: 'down' } },
  })
  @Get('health')
  getHealth() {
    return this.appService.getHealth();
  }
}
