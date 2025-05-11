import { Module } from '@nestjs/common';
import { TagController } from '@app/tag/tag.controller';
import { TagService } from '@app/tag/tag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from '@app/tag/tag.entity';

@Module({
  // forFeature() is used to import the Tag entity into the module
  imports: [TypeOrmModule.forFeature([Tag])],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
