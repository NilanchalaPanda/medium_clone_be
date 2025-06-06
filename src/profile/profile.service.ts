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

    const follow = await this.followRespository.findOne({
      where: { followerId: userId, followingId: user.id },
    });

    return { ...user, following: Boolean(follow) };
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
        'Follower and Following user cannot be the same',
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

  async unFollowProfile(currentUserId: number, profileUserName: string) {
    const profileUser = await this.userRepository.findOne({
      where: { username: profileUserName },
    });

    if (!profileUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (currentUserId === profileUser.id) {
      throw new HttpException(
        'Follower and Following user cannot be the same',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.followRespository.delete({
      followerId: currentUserId,
      followingId: profileUser.id,
    });

    return { ...profileUser, following: false };
  }

  buildProfileResponse(profile: ProfileType): ProfileResponseInterface {
    delete profile.email;
    return { profile: profile };
  }
}
