import {Controller, Get, Req, UseGuards} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthenticationGuard } from "./auth/guards/authentication.guard";


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(AuthenticationGuard)
  someProtectedRoute(@Req() req) {
    return this.appService.getHello();
  }
}
