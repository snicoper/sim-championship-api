import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as nodemailer from 'nodemailer';
import { join } from 'path';

@Injectable()
export class MailService {
  private readonly auth =
    process.env.MAIL_USER && process.env.MAIL_PASSWORD
      ? {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        }
      : undefined;

  private readonly transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: process.env.MAIL_SECURE === 'true',
    auth: this.auth,
  });

  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.MAIL_FROM,
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
