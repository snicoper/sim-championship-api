import { Module } from '@nestjs/common';
import { SecurityModule } from '../../core/security/security.module';
import { UserProfileRepository } from './core/repositories/user-profile.repository';
import { GetBySlugService } from './get-by-slug/get-by-slug.service';
import { MeService } from './me/me.service';
import { SlugAvailabilityService } from './slug-availability/slug-availability.service';
import { UpdateService } from './update/update.service';
import { UploadAvatarService } from './upload-avatar/upload-avatar.service';
import { UserProfilesController } from './user-profiles.controller';
import { StorageModule } from '../../core/storage/storage.module';

@Module({
  controllers: [UserProfilesController],
  providers: [
    UserProfileRepository,
    GetBySlugService,
    UpdateService,
    SlugAvailabilityService,
    MeService,
    UploadAvatarService,
  ],
  imports: [SecurityModule, StorageModule],
})
export class UserProfilesModule {}
