import {Controller, Post, Body, UseGuards, Get, Req} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
// import { LoginDto } from "./dto/login.dto";
import { Request } from 'express';
import { RefreshTokenDto } from "./dto/refresh-tokens.dto";
import {LocalGuard} from "./guards/local.guard";
import {JwtAuthGuard} from "./guards/jwt.guard";


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() userData: RegisterDto) {
    return this.authService.register(userData);
  }

  @Post('login')
  @UseGuards(LocalGuard)
  async login(@Req() req: Request){
    return req.user;
  }

  @Post('refresh')
  async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto){
    const { refreshToken, userId } = refreshTokenDto;
    return this.authService.refreshTokens(refreshToken, userId);
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  async status(@Req() req: Request) {
  return req.user;
  }
}
