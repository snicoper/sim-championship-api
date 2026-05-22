import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { type JwtPayload } from '../../core/security/contracts/jwt-payload.contract';
import { TokenResponse } from '../../core/security/contracts/token.response';
import { CurrentUser } from '../../core/security/decorators/current-user.decorator';
import { Permissions } from '../../core/security/decorators/permissions.decorator';
import { JwtAuthGuard } from '../../core/security/guards/jwt-auth.guard';
import { JwtRefreshTokenGuard } from '../../core/security/guards/jwt-refresh.guard';
import { PermissionsGuard } from '../../core/security/guards/permissions.guard';
import { Permission } from '../../core/security/types/permission.enum';
import { ForgotPasswordRequest } from './forgot-password/forgot-password.request';
import { ForgotPasswordResponse } from './forgot-password/forgot-password.response';
import { ForgotPasswordService } from './forgot-password/forgot-password.service';
import { LoginRequest } from './login/login.request';
import { LoginService } from './login/login.service';
import { LogoutService } from './logout/logout.service';
import { MeResponse } from './me/me.response';
import { MeService } from './me/me.service';
import { RefreshTokenRequest } from './refresh-token/refresh-token.request';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { RegisterRequest } from './register/register.request';
import { RegisterResponse } from './register/register.response';
import { RegisterService } from './register/register.service';
import { ResendVerifyEmailRequest } from './resend-verify-email/resend-verify-email.request';
import { ResendVerifyEmailResponse } from './resend-verify-email/resend-verify-email.response';
import { ResendVerifyEmailService } from './resend-verify-email/resend-verify-email.service';
import { ResetPasswordRequest } from './reset-password/reset-password.request';
import { ResetPasswordService } from './reset-password/reset-password.service';
import { VerifyEmailRequest } from './verify-email/verify-email.request';
import { VerifyEmailService } from './verify-email/verify-email.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerService: RegisterService,
    private readonly loginService: LoginService,
    private readonly meService: MeService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly verifyEmailService: VerifyEmailService,
    private readonly resendVerifyEmailService: ResendVerifyEmailService,
    private readonly logoutService: LogoutService,
    private readonly forgotPasswordService: ForgotPasswordService,
    private readonly resetPasswordService: ResetPasswordService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.UsersRead)
  @HttpCode(HttpStatus.OK)
  me(@CurrentUser() user: JwtPayload): Promise<MeResponse> {
    return this.meService.handle(user.sub);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() dto: RegisterRequest): Promise<RegisterResponse> {
    return this.registerService.handle(dto);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.NO_CONTENT)
  verifyEmail(@Body() dto: VerifyEmailRequest): Promise<void> {
    return this.verifyEmailService.handle(dto);
  }

  @Post('resend-verify-email')
  @HttpCode(HttpStatus.CREATED)
  resendVerificationEmail(
    @Body() dto: ResendVerifyEmailRequest,
  ): Promise<ResendVerifyEmailResponse> {
    return this.resendVerifyEmailService.handle(dto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.CREATED)
  forgotPassword(
    @Body() dto: ForgotPasswordRequest,
  ): Promise<ForgotPasswordResponse> {
    return this.forgotPasswordService.handle(dto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  resetPassword(@Body() dto: ResetPasswordRequest): Promise<void> {
    return this.resetPasswordService.handle(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginRequest): Promise<TokenResponse> {
    return this.loginService.handle(dto);
  }

  @Post('refresh-token')
  @UseGuards(JwtRefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  refresh(
    @CurrentUser() user: JwtPayload,
    @Body() dto: RefreshTokenRequest,
  ): Promise<TokenResponse> {
    return this.refreshTokenService.handle(dto, user.sub);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @Permissions(Permission.UsersRead)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@CurrentUser() user: JwtPayload): Promise<void> {
    await this.logoutService.handle(user.sub);
  }
}
