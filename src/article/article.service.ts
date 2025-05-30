/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArticleDtoTs } from '@app/article/dto/create-article.dto';
import { Article } from '@app/article/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { Users } from '@app/user/user.entity';
import { ArticleResponseInterface } from '@app/article/types/articleResponse.interface';
import slugify from 'slugify';
import { UpdateArticleDtoTs } from './dto/update-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,

    @InjectRepository(Users)
    private userRepository: Repository<Users>,

    private dataSource: DataSource,
  ) {}

  async createArticle(
    user: Users,
    createArticleDto: CreateArticleDtoTs,
  ): Promise<Article> {
    const article = new Article();
    Object.assign(article, createArticleDto);

    // Adding the author of the article
    article.author = user;

    // ~ Adding the slug for the article
    // article.slug = article.title.toLowerCase().trim().split(' ').join('-');
    // article.slug = article.title.toLowerCase().replace(/ /g, '-');

    article.slug = this.generateSlug(article.title);

    if (!article.tagList) {
      article.tagList = [];
    }

    return await this.articleRepository.save(article);
  }

  async getArticleBySlug(slug: string): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { slug },
    });
    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }
    return article;
  }

  async deleteArticleBySlug(
    slug: string,
    userId: number,
  ): Promise<DeleteResult> {
    const article = await this.getArticleBySlug(slug);

    if (!article) {
      throw new HttpException('Article not found.', HttpStatus.NOT_FOUND);
    }

    if (article.author.id !== userId) {
      throw new HttpException('You are not the author.', HttpStatus.FORBIDDEN);
    }

    return await this.articleRepository.delete({ slug });
  }

  async updateArticleBySlug(
    slug: string,
    userId: number,
    updatedArticleDto: UpdateArticleDtoTs,
  ): Promise<Article> {
    const article = await this.getArticleBySlug(slug);

    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }

    if (article.author.id !== userId) {
      throw new HttpException('You are not the author', HttpStatus.FORBIDDEN);
    }

    Object.assign(article, updatedArticleDto);

    if (updatedArticleDto.title && updatedArticleDto.title !== article.slug) {
      article.slug = this.generateSlug(updatedArticleDto.title);
    }

    return this.articleRepository.save(article);
  }

  // ~ Used Query builder for this endpoint.
  async getAllArticles(userId: number, query: any) {
    const queryBuilder = this.dataSource
      .getRepository(Article)
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author');

    const articles = await queryBuilder.getMany();
    const articlesCount = await queryBuilder.getCount();

    // If filters is applied as per authorName
    if (query.author) {
      const author = await this.userRepository.findOne({
        where: { username: query.name },
      });
      queryBuilder.andWhere('article.authorId = :id', {
        id: author?.id,
      });
    }

    // If filter is applied as per TagList name
    if (query.tag) {
      // LIKE is used to search for a sub string. Because rememeber that ragList is a 'single-array', means comma-separated strings.
      queryBuilder.andWhere('article.tagList LIKE :tag', {
        tag: `%${query.tag}%`,
      });
    }

    // If any limit is set.
    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    // If any pagination is needed.
    if (query.skip) {
      queryBuilder.skip(query.skip);
    }

    queryBuilder.orderBy('article.createdAt', 'DESC');

    return { articles, articlesCount };
  }

  async favoriteArticle(userId: number, slug: string): Promise<Article> {
    const article = await this.getArticleBySlug(slug);
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favorites'],
    });

    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isNotFavorited = user?.favorites.every(
      (favorite) => favorite.id !== article.id,
    );

    if (isNotFavorited) {
      user?.favorites.push(article);
      article.favoritesCount++;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }

    return article;
  }

  async unFavoriteArticle(userId: number, slug: string): Promise<Article> {
    const article = await this.getArticleBySlug(slug);
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favorites'],
    });

    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const articleIndex = user?.favorites.findIndex(
      (favorite) => favorite.id !== article.id,
    );

    if (articleIndex) {
      user?.favorites.splice(articleIndex, 1);
      article.favoritesCount--;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }

    return article;
  }

  buildArticleResponse(article: Article): ArticleResponseInterface {
    return { article };
  }

  private generateSlug(slug: string): string {
    const uniqueId = Math.random().toString(36).substring(2);
    return slugify(slug, { lower: true }) + '-' + uniqueId;
  }
}
