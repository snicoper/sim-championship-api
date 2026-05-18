import { Module } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshTokenGuard } from './guards/jwt-refresh.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { SecurityRepository } from './repositories/security.repository';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  providers: [
    SecurityRepository,
    PermissionsGuard,
    JwtAuthGuard,
    JwtRefreshTokenGuard,
    JwtRefreshStrategy,
    JwtStrategy,
  ],
  exports: [
    SecurityRepository,
    PermissionsGuard,
    JwtAuthGuard,
    JwtRefreshTokenGuard,
    JwtRefreshStrategy,
    JwtStrategy,
  ],
})
export class SecurityModule {}
