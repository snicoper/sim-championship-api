import {
  IsEmailField,
  MinLengthField,
} from '../../../core/validators/field.validators';

export class LoginRequest {
  @IsEmailField()
  email!: string;

  @MinLengthField(8)
  password!: string;
}
