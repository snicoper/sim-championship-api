import { Injectable } from '@nestjs/common';
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
      `Verify your ${process.env.APP_NAME} account`,
      'verification-email',
      {
        verificationUrl: `${process.env.FRONTEND_URL}${process.env.VERIFY_EMAIL_URI}?token=${token}`,
      },
    );
  }
}
