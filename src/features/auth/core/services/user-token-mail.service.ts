import { Injectable } from '@nestjs/common';
import { AppConfig } from '../../../../core/config/app.config';
import { MailService } from '../../../../core/mail/mail.service';

@Injectable()
export class UserTokenMailService {
  constructor(private readonly mailService: MailService) {}

  async sendVerificationEmail(
    token: string,
    recipientEmail: string,
  ): Promise<void> {
    await this.mailService.sendTemplateEmail(
      recipientEmail,
      `Verify your ${AppConfig.appName} account`,
      'verification-email',
      {
        verificationUrl: `${AppConfig.front.url}${AppConfig.front.verifyEmailUri}?token=${token}`,
      },
    );
  }

  async sendPasswordResetEmail(
    token: string,
    recipientEmail: string,
  ): Promise<void> {
    await this.mailService.sendTemplateEmail(
      recipientEmail,
      `Reset your ${AppConfig.appName} password`,
      'reset-password',
      {
        resetPasswordUrl: `${AppConfig.front.url}${AppConfig.front.resetPasswordUri}?token=${token}`,
      },
    );
  }
}
