import { Injectable } from '@nestjs/common';

@Injectable()
export class ArticleService {
  createArticle() {
    return 'This is the new article';
  }
}
