import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { UserTokenMailService } from '../core/services/user-token-mail.service';
import { UserTokenService } from '../core/services/user-token.service';
import { ResendVerifyEmailRequest } from './resend-verify-email.request';
import { ResendVerifyEmailResponse } from './resend-verify-email.response';

@Injectable()
export class ResendVerifyEmailService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userTokenService: UserTokenService,
    private readonly userMailTokenService: UserTokenMailService,
  ) {}

  async resendVerificationEmail(
    dto: ResendVerifyEmailRequest,
  ): Promise<ResendVerifyEmailResponse> {
    const normalizedEmail = dto.email.trim().toLowerCase();

    const user = await this.prisma.user.findUnique({
      where: {
        email: normalizedEmail,
        emailVerifiedAt: null,
      },
    });

    const resentVerifyEmailResponse: ResendVerifyEmailResponse = {};

    if (!user) {
      return resentVerifyEmailResponse;
    }

    const verificationToken = await this.createTokenAndSendEmail(
      user,
      normalizedEmail,
    );

    if (process.env.NODE_ENV !== 'production') {
      resentVerifyEmailResponse.verificationToken = verificationToken;
    }

    return resentVerifyEmailResponse;
  }

  private async createTokenAndSendEmail(
    user: User,
    email: string,
  ): Promise<string> {
    const token = await this.userTokenService.createUserToken(user.id, email);
    await this.userMailTokenService.sendVerificationEmail(token, email);

    return token;
  }
}
