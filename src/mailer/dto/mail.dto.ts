import {Address} from "nodemailer/lib/mailer";

export type SendEmailDto = {
    from?: Address;
    to: Address[];
    subject: string;
    html: string;
    text?: string;
    placheholderReplace?: Record<string, string>
}