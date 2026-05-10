import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../prisma/prisma.service';
import { AppConfig } from '../../common/config/app.config';
import { JwtPayload } from '../contracts/jwt-payload.contract';
import { LoginRequest } from './login.request';
import { LoginResponse } from './login.response';

@Injectable()
export class LoginService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginRequest) {
    const normalizedEmail = dto.email.trim().toLowerCase();

    const user = await this.prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!user) {
      return new UnauthorizedException({
        message: 'Invalid credentials',
      });
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      return new UnauthorizedException({
        message: 'Invalid credentials',
      });
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    const expiresIn = AppConfig.jwt.expiresInMinutes * 60;
    const loginResult: LoginResponse = {
      accessToken,
      expiresIn,
    };

    return loginResult;
  }
}
