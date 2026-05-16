import { IsEmail } from 'class-validator';

export class ResendVerifyEmailRequest {
  @IsEmail()
  email!: string;
}
