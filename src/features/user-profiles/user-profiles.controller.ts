import { Controller, Get, Put } from '@nestjs/common';

@Controller('user-profiles')
export class UserProfilesController {
  constructor() {}

  @Get(':nickname')
  getById(): string {
    return 'This action returns a #id user-profile';
  }

  @Put(':nickname')
  updateById(): string {
    return 'This action updates a #id user-profile';
  }
}
