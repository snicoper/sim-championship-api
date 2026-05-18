import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as nodemailer from 'nodemailer';
import { join } from 'path';
import { AppConfig } from '../config/app.config';

@Injectable()
export class MailService {
  private readonly auth =
    AppConfig.mail.user && AppConfig.mail.password
      ? {
          user: AppConfig.mail.user,
          pass: AppConfig.mail.password,
        }
      : undefined;

  private readonly transporter = nodemailer.createTransport({
    host: AppConfig.mail.host,
    port: Number(AppConfig.mail.port),
    secure: AppConfig.mail.secure,
    auth: this.auth,
  });

  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    await this.transporter.sendMail({
      from: AppConfig.mail.from,
      to,
      subject,
      text,
    });
  }

  async sendTemplateEmail(
    to: string,
    subject: string,
    templateName: string,
    variables: Record<string, string>,
  ): Promise<void> {
    const templatePath = join(
      process.cwd(),
      'src/core/mail/templates',
      `${templateName}.txt`,
    );

    let content = await fs.readFile(templatePath, 'utf-8');

    for (const [key, value] of Object.entries(variables)) {
      content = content.replaceAll(`{{${key}}}`, value);
    }

    await this.sendEmail(to, subject, content);
  }
}
