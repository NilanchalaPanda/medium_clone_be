import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArticleService } from '@app/article/article.service';
import { AuthGuard } from '@app/user/guards/auth/auth.guard';
import { User } from '@app/user/decorators/user/user.decorator';
import { CreateArticleDtoTs } from '@app/article/dto/create-article.dto';
import { Users } from '@app/user/user.entity';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  async createArticle(
    @User() user: Users,
    @Body('article') createArticleDto: CreateArticleDtoTs,
  ) {
    const article = await this.articleService.createArticle(
      user,
      createArticleDto,
    );
    return { article };
  }
}
