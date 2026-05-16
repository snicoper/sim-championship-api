import { ConflictException, Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { UserTokenType } from '../types/user-token.type';

@Injectable()
export class UserTokenService {
  constructor(private readonly prisma: PrismaService) {}

  async createEmailVerificationToken(
    userId: string,
    email: string,
  ): Promise<string> {
    const token = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(token).digest('hex');

    await this.prisma.userToken.create({
      data: {
        userId,
        email,
        type: UserTokenType.EMAIL_VERIFICATION,
        tokenHash,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });

    return token;
  }

  async verifyEmailToken(token: string): Promise<void> {
    const tokenHash = createHash('sha256').update(token).digest('hex');

    const userToken = await this.prisma.userToken.findFirst({
      where: {
        tokenHash,
        type: UserTokenType.EMAIL_VERIFICATION,
        expiresAt: { gt: new Date() },
        usedAt: null,
      },
    });

    if (userToken === null) {
      throw new ConflictException('Invalid or expired token');
    }

    const now = new Date();

    await this.prisma.$transaction([
      this.prisma.userToken.update({
        where: { id: userToken.id },
        data: { usedAt: now },
      }),

      this.prisma.user.update({
        where: { id: userToken.userId! },
        data: { emailVerifiedAt: now },
      }),
    ]);
  }
}
