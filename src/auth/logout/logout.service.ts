import { Injectable } from '@nestjs/common';
import { TokenService } from '../services/token.service';

@Injectable()
export class LogoutService {
  constructor(private readonly tokenService: TokenService) {}

  async logout(userId: string): Promise<void> {
    await this.tokenService.clearRefreshToken(userId);
  }
}
