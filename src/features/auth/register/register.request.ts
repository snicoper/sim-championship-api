import {
  IsEmailField,
  MinLengthField,
} from '../../../core/validators/field.validators';

export class RegisterRequest {
  @IsEmailField()
  email!: string;

  @MinLengthField(8)
  password!: string;

  @MinLengthField(8)
  confirmPassword!: string;
}
