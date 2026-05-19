import { IsEmailField } from '../../../core/validators/custom-validator';

export class ResendVerifyEmailRequest {
  @IsEmailField()
  email!: string;
}
