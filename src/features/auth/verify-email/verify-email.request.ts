import { IsNotEmptyField } from '../../../core/validators/field.validators';

export class VerifyEmailRequest {
  @IsNotEmptyField()
  token!: string;
}
