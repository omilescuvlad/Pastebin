import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Role } from '../enums/role.enum';
import { Request as ExpressRequest } from 'express';
import { SignInDto } from './dto/sign-in.dto';

type AuthenticatedRequest = ExpressRequest & {
  user: {
    sub: number;
    username: string;
    roles: Role[];
  };
};

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Sign in and receive a JWT access token' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Read the authenticated JWT profile' })
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: AuthenticatedRequest) {
    return req.user;
  }
}
