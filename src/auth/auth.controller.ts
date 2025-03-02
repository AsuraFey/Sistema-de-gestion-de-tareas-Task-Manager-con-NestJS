import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-tokens.dto";


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() userData: RegisterDto) {
    return this.authService.register(userData);
  }

  @Post('login')
  async login(@Body() credentials: LoginDto){
    return this.authService.login(credentials);
  }

  @Post('refresh')
  async refreshTokens(@Body() refreshTokenDto: RefreshTokenDto){
    const { refreshToken, userId } = refreshTokenDto;
    return this.authService.refreshTokens(refreshToken, userId);
  }
}
