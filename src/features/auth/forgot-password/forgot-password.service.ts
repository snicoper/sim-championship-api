import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ForgotPasswordRequest } from './forgot-password.request';

@Injectable()
export class ForgotPasswordService {
  constructor(private readonly prisma: PrismaService) {}

  async forgotPassword(request: ForgotPasswordRequest): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { email: request.email },
    });

    if (!user) {
      throw new ConflictException({
        code: 'user_not_found',
        detail: 'User not found',
      });
    }
  }
}
