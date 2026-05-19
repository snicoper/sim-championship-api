import { applyDecorators } from '@nestjs/common';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { RegexUtils } from '../utils/regex.utils';

export function IsStringField(): PropertyDecorator {
  return applyDecorators(
    IsString({
      message: 'isStringField',
    }),
  );
}

export function IsNotEmptyField(): PropertyDecorator {
  return applyDecorators(
    IsStringField(),
    IsNotEmpty({
      message: 'isNotEmptyField',
    }),
  );
}

export function IsEmailField(): PropertyDecorator {
  return applyDecorators(
    IsStringField(),
    IsNotEmptyField(),
    Matches(RegexUtils.email, {
      message: 'isEmailField',
    }),
  );
}

export function IsSlugField(): PropertyDecorator {
  return applyDecorators(
    IsStringField(),
    IsNotEmptyField(),
    Matches(RegexUtils.slug, {
      message: 'isSlugField',
    }),
  );
}

export function MinLengthField(minLength: number): PropertyDecorator {
  return applyDecorators(
    IsStringField(),
    IsNotEmptyField(),
    MinLength(minLength, {
      message: 'minLengthField',
    }),
  );
}

export function IsOptionalField(): PropertyDecorator {
  return applyDecorators(
    IsStringField(),
    IsOptional({
      message: 'isOptionalField',
    }),
  );
}
