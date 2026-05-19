import { IsNotEmpty, IsString } from 'class-validator';

export class GetBySlugRequest {
  @IsString()
  @IsNotEmpty()
  slug!: string;
}
