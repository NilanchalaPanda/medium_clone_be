import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArticleService } from '@app/article/article.service';
import { AuthGuard } from '@app/user/guards/auth/auth.guard';
import { User } from '@app/user/decorators/user/user.decorator';
import { CreateArticleDtoTs } from '@app/article/dto/create-article.dto';
import { Users } from '@app/user/user.entity';
import { ArticleResponseInterface } from './types/articleResponse.interface';
import { UpdateArticleDtoTs } from './dto/update-article.dto';
import { MultipleArticleResponseInterface } from './types/multipleArticleResponse.interface';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  async createArticle(
    @User() user: Users,
    @Body('article') createArticleDto: CreateArticleDtoTs,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.createArticle(
      user,
      createArticleDto,
    );
    return this.articleService.buildArticleResponse(article);
  }

  @Get(':slug')
  @UsePipes(ValidationPipe)
  async getArticle(
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.getArticleBySlug(slug);
    return this.articleService.buildArticleResponse(article);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  async deleteArticle(@Param('slug') slug: string, @User('id') userId: number) {
    return await this.articleService.deleteArticleBySlug(slug, userId);
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  async updateArticle(
    @Param('slug') slug: string,
    @User('id') userId: number,
    @Body('article') updatedArticleDto: UpdateArticleDtoTs,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.updateArticleBySlug(
      slug,
      userId,
      updatedArticleDto,
    );

    return this.articleService.buildArticleResponse(article);
  }

  @Get()
  async getAllArticles(
    @User('id') userId: number,
    query: any,
  ): Promise<MultipleArticleResponseInterface> {
    const articles = await this.articleService.getAllArticles(userId, query);
    return articles;
  }

  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  async favoriteArticle(
    @User('id') userId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.favoriteArticle(userId, slug);
    return this.articleService.buildArticleResponse(article);
  }

  @Delete(':slug/favorite')
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  async unFavoriteArticle(
    @User('id') userId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.unFavoriteArticle(userId, slug);
    return this.articleService.buildArticleResponse(article);
  }
}
