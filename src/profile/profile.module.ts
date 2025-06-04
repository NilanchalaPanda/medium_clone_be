import { Module } from '@nestjs/common';
import { ProfileController } from '@app/profile/profile.controller';
import { ProfileService } from '@app/profile/profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '@app/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
