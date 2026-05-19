import { IsEmailField } from '../../../core/validators/custom-validator';

export class ForgotPasswordRequest {
  @IsEmailField()
  email!: string;
}
