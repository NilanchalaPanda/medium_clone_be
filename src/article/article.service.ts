import { Injectable } from '@nestjs/common';
import { CreateArticleDtoTs } from '@app/article/dto/create-article.dto';
import { Article } from '@app/article/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '@app/user/user.entity';
import { ArticleResponseInterface } from '@app/article/types/articleResponse.interface';
import slugify from 'slugify';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async createArticle(
    user: Users,
    createArticleDto: CreateArticleDtoTs,
  ): Promise<Article> {
    const article = new Article();
    Object.assign(article, createArticleDto);

    // Adding the author of the article
    article.author = user;

    // ! NEED SOME MODIFICATION HERE.

    // ~ Adding the slug for the article
    // article.slug = article.title.toLowerCase().trim().split(' ').join('-');
    // article.slug = article.title.toLowerCase().replace(/ /g, '-');

    article.slug = this.generateSlug(article.title);

    if (!article.tagList) {
      article.tagList = [];
    }

    return await this.articleRepository.save(article);
  }

  buildArticleResponse(article: Article): ArticleResponseInterface {
    return { article };
  }

  private generateSlug(slug: string): string {
    const uniqueId = Math.random().toString(36).substring(2);
    return slugify(slug, { lower: true }) + '-' + uniqueId;
  }
}
