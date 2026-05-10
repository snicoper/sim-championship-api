import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../prisma/prisma.service';
import { TokenResponse } from '../contracts/token.response';
import { LoginRequest } from './login.request';
import { TokenService } from '../services/token.service';

@Injectable()
export class LoginService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: TokenService,
  ) {}

  async login(dto: LoginRequest): Promise<TokenResponse> {
    const normalizedEmail = dto.email.trim().toLowerCase();

    const user = await this.prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!user) {
      throw new UnauthorizedException({
        message: 'Invalid credentials',
      });
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException({
        message: 'Invalid credentials',
      });
    }

    const tokenResponse = await this.authService.issueTokens(user);

    return tokenResponse;
  }
}
