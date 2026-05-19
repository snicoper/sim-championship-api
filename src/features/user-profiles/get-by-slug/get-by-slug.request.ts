import { IsNotEmptyField } from '../../../core/validators/field.validators';

export class GetBySlugRequest {
  @IsNotEmptyField()
  slug!: string;
}
