import {Controller, Get, Req, UseGuards} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from "./auth/guards/auth.guard";


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(AuthGuard)
  someProtectedRoute(@Req() req) {
    return { message: "Resource accessed ", userId: req.userId};
  }
}
