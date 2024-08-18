import * as nodemailer from 'nodemailer'
import SMTPTransport from "nodemailer/lib/smtp-transport";
import {Transporter} from "nodemailer";

class MailService {
    public transporter: Transporter<SMTPTransport.SentMessageInfo>;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST as string,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }

    async sendActivationMail(to: string, link: string) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Активация аккаунта на ' + process.env.API_URL,
            text: '',
            html:
                `
            <div>
            <h1>Для активации перейдите по ссылке</h1>
            <a href="${link}">${link}</a>
</div>
            `
        })
    }
}

export default MailService
