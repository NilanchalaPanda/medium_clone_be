import { Article } from '@app/article/article.entity';

export interface MultipleArticleResponseInterface {
  articles: Article[];
  articlesCount: number;
}
