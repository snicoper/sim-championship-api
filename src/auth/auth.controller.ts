import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginDto } from './login/login.dto';
import { LoginService } from './login/login.service';
import { MeService } from './me/me.service';
import { RegisterDto } from './register/register.dto';
import { RegisterService } from './register/register.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerService: RegisterService,
    private readonly loginService: LoginService,
    private readonly meService: MeService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: Request & { user: JwtPayload }) {
    return this.meService.getMe(req.user.sub);
  }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.registerService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.loginService.login(dto);
  }
}
