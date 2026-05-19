import { IsNotEmptyField } from '../../../core/validators/field.validators';

export class RefreshTokenRequest {
  @IsNotEmptyField()
  refreshToken!: string;
}
