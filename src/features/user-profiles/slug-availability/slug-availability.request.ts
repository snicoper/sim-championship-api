import { IsSlugField } from '../../../core/validators/field.validators';

export class SlugAvailabilityRequest {
  @IsSlugField()
  slug!: string;
}
