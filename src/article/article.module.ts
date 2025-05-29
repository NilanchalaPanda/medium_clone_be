import { Module } from '@nestjs/common';
import { ArticleController } from '@app/article/article.controller';
import { ArticleService } from '@app/article/article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from '@app/article/article.entity';
import { Users } from '@app/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Users])],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
