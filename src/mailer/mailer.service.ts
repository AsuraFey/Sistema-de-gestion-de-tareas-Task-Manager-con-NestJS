import { Injectable } from '@nestjs/common';
import * as nodemailer from "nodemailer"
import {ConfigService} from "@nestjs/config";
import {SendEmailDto} from "./dto/mail.dto";
import Mail from "nodemailer/lib/mailer";

@Injectable()
export class MailerService {
    constructor(
        private readonly configService: ConfigService) {
    }
    mailTransport() {
       return nodemailer.createTransport({
            host: this.configService.get<string>('MAIL_HOST'),
            port: this.configService.get<number>('MAIL_PORT'),
            secure: false, // true for port 465, false for other ports
            auth: {
                user: this.configService.get<string>('MAIL_USER'),
                pass: this.configService.get<string>('MAIL_PASSWORD'),
            },
        });
    }

    async sendEmail(email: SendEmailDto){
        const {
            from,
            to,
            placheholderReplace,
            text,
            subject,
            html
        } = email;

        const transport = this.mailTransport();
        const options: Mail.Options = {
            from: from?? {
                name: "TaskManager", //this.configService.get<string>('APP_NAME'),
                address: "alexydelgado@gmail.com"//this.configService.get<string>('DEFAULT_MAIL_FROM'),
            },
            to: to,
            subject,
            html,
        };

        try{
            return transport.sendMail(options)
        } catch (error) {
            console.log("Error: ", error)
        }

    }
}
