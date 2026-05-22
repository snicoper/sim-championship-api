import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { type JwtPayload } from '../../core/security/contracts/jwt-payload.contract';
import { CurrentUser } from '../../core/security/decorators/current-user.decorator';
import { Permissions } from '../../core/security/decorators/permissions.decorator';
import { JwtAuthGuard } from '../../core/security/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../core/security/guards/permissions.guard';
import { Permission } from '../../core/security/types/permission.enum';
import { type StorageFileUpload } from '../../core/storage/storage-upload-file.model';
import { GetBySlugRequest } from './get-by-slug/get-by-slug.request';
import { GetBySlugResponse } from './get-by-slug/get-by-slug.response';
import { GetBySlugService } from './get-by-slug/get-by-slug.service';
import { MeResponse } from './me/me.response';
import { MeService } from './me/me.service';
import { SlugAvailabilityRequest } from './slug-availability/slug-availability.request';
import { SlugAvailabilityResponse } from './slug-availability/slug-availability.response';
import { SlugAvailabilityService } from './slug-availability/slug-availability.service';
import { UpdateRequest } from './update/update.request';
import { UpdateResponse } from './update/update.response';
import { UpdateService } from './update/update.service';
import { UploadAvatarResponse } from './upload-avatar/upload-avatar.response';
import { UploadAvatarService } from './upload-avatar/upload-avatar.service';

@Controller('user-profiles')
export class UserProfilesController {
  constructor(
    private readonly getBySlugService: GetBySlugService,
    private readonly updateService: UpdateService,
    private readonly slugAvailabilityService: SlugAvailabilityService,
    private readonly meService: MeService,
    private readonly uploadAvatarService: UploadAvatarService,
  ) {}

  @Get('slug-availability/:slug')
  @HttpCode(HttpStatus.OK)
  async slugAvailability(
    @Param() request: SlugAvailabilityRequest,
  ): Promise<SlugAvailabilityResponse> {
    return this.slugAvailabilityService.handle(request.slug);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.UserProfilesRead)
  @HttpCode(HttpStatus.OK)
  getMe(@CurrentUser() user: JwtPayload): Promise<MeResponse | null> {
    return this.meService.handle(user.sub);
  }

  @Get(':slug')
  @HttpCode(HttpStatus.OK)
  getBySlug(@Param() request: GetBySlugRequest): Promise<GetBySlugResponse> {
    return this.getBySlugService.handle(request);
  }

  @Post('upload-avatar')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.UserProfilesUpdate)
  @UseInterceptors(FileInterceptor('avatar'))
  uploadAvatar(
    @CurrentUser() user: JwtPayload,
    @UploadedFile() file: StorageFileUpload,
  ): Promise<UploadAvatarResponse> {
    return this.uploadAvatarService.handle(user.sub, file);
  }

  @Put()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.UserProfilesUpdate)
  @HttpCode(HttpStatus.OK)
  update(
    @CurrentUser() user: JwtPayload,
    @Body() request: UpdateRequest,
  ): Promise<UpdateResponse> {
    return this.updateService.handle(request, user.sub);
  }
}
