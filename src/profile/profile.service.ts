import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProfileType } from './types/profile.types';
import { ProfileResponseInterface } from './types/profileResponseInterface';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '@app/user/user.entity';
import { Repository } from 'typeorm';
import { FollowEntity } from './follow.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,

    @InjectRepository(FollowEntity)
    private readonly followRespository: Repository<FollowEntity>,
  ) {}

  async getProfile(userId: number, userName: string): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      where: { username: userName },
    });

    if (!user) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }

    return { ...user, following: false };
  }

  async followProfile(currentUserId: number, profileUserName: string) {
    const profileUser = await this.userRepository.findOne({
      where: { username: profileUserName },
    });

    if (!profileUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (currentUserId === profileUser.id) {
      throw new HttpException(
        'You cannot follow yourself',
        HttpStatus.BAD_REQUEST,
      );
    }

    const follow = await this.followRespository.findOne({
      where: { followerId: currentUserId, followingId: profileUser.id },
    });

    if (!follow) {
      const newFollow = new FollowEntity();
      newFollow.followerId = currentUserId;
      newFollow.followingId = profileUser.id;
      await this.followRespository.save(newFollow);
    }

    return { ...profileUser, following: true };
  }

  buildProfileResponse(profile: ProfileType): ProfileResponseInterface {
    delete profile.email;
    return { profile: profile };
  }
}
