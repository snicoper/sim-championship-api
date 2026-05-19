import {
  IsNotEmptyField,
  IsOptionalField,
  IsSlugField,
} from '../../../core/validators/field.validators';

export class UpdateRequest {
  @IsNotEmptyField()
  nickname!: string;

  @IsSlugField()
  slug!: string;

  @IsOptionalField()
  firstName?: string;

  @IsOptionalField()
  lastName?: string;

  @IsOptionalField()
  country?: string;

  @IsOptionalField()
  bio?: string;

  @IsOptionalField()
  avatarUrl?: string;
}
