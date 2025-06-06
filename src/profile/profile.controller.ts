import { User } from '@app/user/decorators/user/user.decorator';
import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProfileResponseInterface } from '@app/profile/types/profileResponseInterface';
import { ProfileService } from '@app/profile/profile.service';
import { AuthGuard } from '@app/user/guards/auth/auth.guard';

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

  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async followProfile(
    @User('id') userId: number,
    @Param('username') profileUserName: string,
  ): Promise<ProfileResponseInterface> {
    const profile = await this.profileService.followProfile(
      userId,
      profileUserName,
    );
    return this.profileService.buildProfileResponse(profile);
  }
}
