import { Injectable } from '@nestjs/common';
import { UserProfile } from '@prisma/client';
import { PrismaService } from '../../../../../prisma/prisma.service';

@Injectable()
export class UserProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string): Promise<UserProfile | null> {
    return await this.prisma.userProfile.findUnique({ where: { id } });
  }

  async getByUserId(userId: string): Promise<UserProfile | null> {
    return await this.prisma.userProfile.findUnique({ where: { userId } });
  }

  async getBySlug(slug: string): Promise<UserProfile | null> {
    return await this.prisma.userProfile.findUnique({ where: { slug } });
  }

  async upsertByUserId(
    userId: string,
    data: UserProfile,
  ): Promise<UserProfile> {
    return await this.prisma.userProfile.upsert({
      where: { userId },

      update: {
        nickname: data.nickname,
        slug: data.slug,
        firstName: data.firstName,
        lastName: data.lastName,
        country: data.country,
        bio: data.bio,
        avatarUrl: data.avatarUrl,
        updatedAt: data.updatedAt,
      },

      create: data,
    });
  }
}
