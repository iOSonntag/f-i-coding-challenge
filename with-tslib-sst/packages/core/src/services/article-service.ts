import { genUuid } from ':tslib-sst/api-code/use-utilities/value-generators';
import { Article, ArticleEntity } from '../_database/entities/Article';
import { PagedResponse } from './models';



export * as ArticleService from './article-service';


export const getArticleById = async (articleId: string): Promise<ArticleEntity | null> =>
{
  const article = await Article.get({
    articleId: articleId,
  }).go();

  return article.data;
}

export const getArticles = async (cursor?: string): Promise<PagedResponse<ArticleEntity>> =>
{
  const articles = await Article.query.article({
  }).go({
    cursor: cursor,
    pages: 'all',
    limit: 25,
  });

  return {
    items: articles.data,
    cursor: articles.cursor,
  };
}

type CreateArticleParams = {
  name: string;
  description?: string;
  price: number;
  currency: 'EUR';
}

export const createArticle = async (params: CreateArticleParams): Promise<ArticleEntity> =>
{
  const newArticle = await Article.create({
    articleId: genUuid(),
    ...params,
  }).go();

  return newArticle.data;
}