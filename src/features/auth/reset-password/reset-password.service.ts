import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { UserTokenService } from '../core/services/user-token.service';
import { ResetPasswordRequest } from './reset-password.request';

@Injectable()
export class ResetPasswordService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userTokenService: UserTokenService,
  ) {}

  async resetPassword(request: ResetPasswordRequest): Promise<void> {
    if (request.password !== request.confirmPassword) {
      throw new BadRequestException({
        errors: {
          password: ['confirmPassword must match password'],
        },
      });
    }

    await this.userTokenService.consumePasswordResetToken(
      request.token,
      request.password,
    );
  }
}
