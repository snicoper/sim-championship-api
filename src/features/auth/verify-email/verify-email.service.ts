import { Injectable } from '@nestjs/common';
import { UserTokenService } from '../core/services/user-token.service';
import { VerifyEmailRequest } from './verify-email.request';

@Injectable()
export class VerifyEmailService {
  constructor(private readonly userTokenService: UserTokenService) {}

  async verifyEmail(request: VerifyEmailRequest): Promise<void> {
    await this.userTokenService.consumeEmailVerificationToken(request.token);
  }
}
