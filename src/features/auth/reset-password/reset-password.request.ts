import {
  IsNotEmptyField,
  MinLengthField,
} from '../../../core/validators/field.validators';

export class ResetPasswordRequest {
  @IsNotEmptyField()
  token!: string;

  @MinLengthField(8)
  password!: string;

  @MinLengthField(8)
  confirmPassword!: string;
}
