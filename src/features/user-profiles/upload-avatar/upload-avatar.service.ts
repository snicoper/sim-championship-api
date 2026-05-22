import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { type FileStorage } from '../../../core/storage/file-storage.interface';
import { StorageFolders } from '../../../core/storage/storage-folders.model';
import { StorageFileUpload } from '../../../core/storage/storage-upload-file.model';
import { FILE_STORAGE } from '../../../core/storage/storage.constants';
import { UserProfileRepository } from '../core/repositories/user-profile.repository';
import { UploadAvatarResponse } from './upload-avatar.response';

@Injectable()
export class UploadAvatarService {
  constructor(
    @Inject(FILE_STORAGE)
    private readonly fileStorage: FileStorage,
    private readonly userProfileRepository: UserProfileRepository,
  ) {}

  async handle(
    userId: string,
    file: StorageFileUpload,
  ): Promise<UploadAvatarResponse> {
    if (!file) {
      throw new BadRequestException({
        errors: {
          avatar: ['fileIsRequired'],
        },
      });
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'] as const;

    if (!allowedMimeTypes.some((mimeType) => mimeType === file.mimetype)) {
      throw new BadRequestException({
        errors: {
          avatar: ['invalidAvatarMimeType'],
        },
      });
    }

    const extension = this.getExtension(file.mimetype);
    const filename = `${userId}-${Date.now()}.${extension}`;

    const storedFile = await this.fileStorage.save({
      folder: StorageFolders.avatars,
      filename,
      buffer: file.buffer,
      mimeType: file.mimetype,
      originalName: file.originalname,
    });

    const profile = await this.userProfileRepository.getByUserId(userId);

    if (!profile) {
      throw new NotFoundException('User profile not found');
    }

    const oldAvatarKey = profile.avatarUrl
      ? this.getStorageKeyFromUrl(profile.avatarUrl)
      : null;

    profile.avatarUrl = storedFile.url;
    await this.userProfileRepository.upsertByUserId(userId, profile);

    const result: UploadAvatarResponse = {
      avatarUrl: profile.avatarUrl,
    };

    try {
      if (oldAvatarKey) {
        await this.fileStorage.delete(oldAvatarKey);
      }
    } catch {
      // ignore
    }

    return result;
  }

  private getExtension(mimeType: string): string {
    const mimeTypeExtensions: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
    };

    return mimeTypeExtensions[mimeType];
  }

  private getStorageKeyFromUrl(url: string): string {
    return url.replace('/uploads/', '');
  }
}
