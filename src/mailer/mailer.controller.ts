import {Controller, Post} from '@nestjs/common';
import { MailerService } from './mailer.service';
import {SendEmailDto} from "./dto/mail.dto";

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post()
  async sendMail(emailDto: SendEmailDto){
    return await this.mailerService.sendEmail(emailDto)
  }

}
