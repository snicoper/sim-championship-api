import { ConflictException, Injectable } from '@nestjs/common';
import { UserToken } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { UserTokenType } from '../types/user-token.type';

@Injectable()
export class UserTokenService {
  constructor(private readonly prisma: PrismaService) {}

  async createUserToken(
    userId: string,
    email: string,
    userTokenType: UserTokenType,
  ): Promise<string> {
    const token = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(token).digest('hex');

    await this.prisma.userToken.create({
      data: {
        userId,
        email,
        type: userTokenType,
        tokenHash,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });

    return token;
  }

  async consumeToken(token: string, type: UserTokenType): Promise<void> {
    const userToken = await this.getUserToken(token, type);

    await this.prisma.userToken.update({
      where: { id: userToken.id },
      data: { usedAt: new Date() },
    });
  }

  async consumeEmailVerificationToken(token: string): Promise<void> {
    const userToken = await this.getUserToken(
      token,
      UserTokenType.EMAIL_VERIFICATION,
    );

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

  async consumePasswordResetToken(
    token: string,
    password: string,
  ): Promise<void> {
    const userToken = await this.getUserToken(
      token,
      UserTokenType.PASSWORD_RESET,
    );

    const passwordHash = await bcrypt.hash(password, 10);

    await this.prisma.$transaction([
      this.prisma.userToken.update({
        where: { id: userToken.id },
        data: { usedAt: new Date() },
      }),

      this.prisma.user.update({
        where: { id: userToken.userId! },
        data: { passwordHash, refreshTokenHash: null },
      }),
    ]);
  }

  private async getUserToken(
    token: string,
    type: UserTokenType,
  ): Promise<UserToken> {
    const tokenHash = createHash('sha256').update(token).digest('hex');

    const userToken = await this.prisma.userToken.findFirst({
      where: {
        tokenHash,
        type: type,
        expiresAt: { gt: new Date() },
        usedAt: null,
      },
    });

    if (!userToken) {
      throw new ConflictException('Invalid or expired token');
    }

    return userToken;
  }
}
