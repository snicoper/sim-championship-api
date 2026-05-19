import { Injectable } from '@nestjs/common';
import { UserProfile } from '@prisma/client';
import { randomUUID } from 'crypto';
import { UserProfileRepository } from '../core/repositories/user-profile.repository';
import { UpdateRequest } from './update.request';
import { UpdateResponse } from './update.response';

@Injectable()
export class UpdateService {
  constructor(private readonly userProfileRepository: UserProfileRepository) {}

  async handle(
    request: UpdateRequest,
    userId: string,
  ): Promise<UpdateResponse> {
    const userProfile = await this.userProfileRepository.getByUserId(userId);

    const data: UserProfile = {
      id: userProfile?.id ?? randomUUID(),
      userId,
      nickname: request.nickname,
      slug: request.slug,
      firstName: request.firstName ?? userProfile?.firstName ?? null,
      lastName: request.lastName ?? userProfile?.lastName ?? null,
      country: request.country ?? userProfile?.country ?? null,
      bio: request.bio ?? userProfile?.bio ?? null,
      avatarUrl: request.avatarUrl ?? userProfile?.avatarUrl ?? null,
      createdAt: userProfile?.createdAt ?? new Date(),
      updatedAt: new Date(),
    };

    await this.userProfileRepository.upsertByUserId(userId, data);

    const result: UpdateResponse = {
      id: data.id,
    };

    return result;
  }
}
