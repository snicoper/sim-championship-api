import { Injectable } from '@nestjs/common';
import { UserProfileRepository } from '../core/repositories/user-profile.repository';
import { SlugAvailabilityResponse } from './slug-availability.response';

@Injectable()
export class SlugAvailabilityService {
  constructor(private readonly userProfileRepository: UserProfileRepository) {}

  async handle(slug: string): Promise<SlugAvailabilityResponse> {
    const userProfile = await this.userProfileRepository.getBySlug(slug);

    const result: SlugAvailabilityResponse = {
      isAvailable: !userProfile,
    };

    return result;
  }
}
