import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../../prisma/prisma.service';
import { MailService } from '../../../core/mail/mail.service';
import { UserTokenService } from '../core/services/user-token.service';
import { RegisterRequest } from './register.request';
import { RegisterResponse } from './register.response';

@Injectable()
export class RegisterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userTokenService: UserTokenService,
    private readonly mailService: MailService,
  ) {}

  async register(dto: RegisterRequest): Promise<RegisterResponse> {
    const normalizedEmail = dto.email.trim().toLowerCase();

    this.validatePassword(dto.password, dto.confirmPassword);
    await this.validateUserDoesNotExist(normalizedEmail);

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.createUser(normalizedEmail, passwordHash);

    await this.createTokenAndSendEmail(user, normalizedEmail);

    const registerResponse: RegisterResponse = {
      id: user.id,
      email: user.email,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return registerResponse;
  }

  private async createUser(email: string, passwordHash: string): Promise<User> {
    return this.prisma.user.create({
      data: {
        email,
        passwordHash,
      },
    });
  }

  private async createTokenAndSendEmail(
    user: User,
    email: string,
  ): Promise<void> {
    const token = await this.userTokenService.createEmailVerificationToken(
      user.id,
      email,
    );
    await this.mailService.sendTemplateEmail(
      user.email,
      'Verify your VRM account',
      'verification-email',
      {
        verificationUrl: `${process.env.FRONTEND_URL}/verify-email?token=${token}`,
      },
    );
  }

  private validatePassword(password: string, confirmPassword: string): void {
    if (password !== confirmPassword) {
      throw new BadRequestException({
        errors: {
          confirmPassword: ['confirmPassword must match password'],
        },
      });
    }
  }

  private async validateUserDoesNotExist(email: string): Promise<void | null> {
    const errors: Record<string, string[]> = {};

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }],
      },
    });

    if (existingUser === null) {
      return null;
    }

    if (existingUser.email === email) {
      errors.email = ['Email is already in use'];
    }

    if (Object.keys(errors).length > 0) {
      throw new BadRequestException({
        errors: errors,
      });
    }
  }
}
