import { User } from '@app/user/decorators/user/user.decorator';
import { Controller, Get, Param } from '@nestjs/common';
import { ProfileResponseInterface } from '@app/profile/types/profileResponseInterface';
import { ProfileService } from '@app/profile/profile.service';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  async getProfile(
    @User('id') userId: number,
    @Param('username') profileUserName: string,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.getProfile(
      userId,
      profileUserName,
    );

    return this.profileService.buildProfileResponse(profile);
  }
}
