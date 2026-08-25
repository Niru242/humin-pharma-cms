import { Controller, Get, Put, Post, Body } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CurrentUser, RequestUser } from '../auth/decorators/current-user.decorator';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  /** GET /v1/profile — My profile. */
  @Get()
  async getMyProfile(@CurrentUser() user: RequestUser) {
    return this.profileService.getMyProfile(user.id);
  }

  /** PUT /v1/profile — Update my profile (name). */
  @Put()
  async updateMyProfile(
    @CurrentUser() user: RequestUser,
    @Body() body: { firstName?: string; lastName?: string },
  ) {
    return this.profileService.updateMyProfile(user.id, body);
  }

  /** POST /v1/profile/accept-privacy-policy — Accept privacy policy version. */
  @Post('accept-privacy-policy')
  async acceptPrivacyPolicy(
    @CurrentUser() user: RequestUser,
    @Body('version') version: string,
  ) {
    return this.profileService.acceptPrivacyPolicy(user.id, version);
  }
}
