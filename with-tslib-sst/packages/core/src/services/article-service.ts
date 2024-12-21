import { genUuid } from ':tslib-sst/api-code/use-utilities/value-generators';
import { Article, ArticleEntity } from '../_database/entities/Article';
import { PaginatedResponse } from './_models';
import { Dev } from ':tslib-sst/api-code/utils/dev';



export * as ArticleService from './article-service';

/**
 * Get an article by its ID. Returns null if no article is found.
 */
export const getArticleById = async (articleId: string): Promise<ArticleEntity | null> =>
{
  Dev.log('Getting article by ID...', articleId);

  const article = await Article.get({
    articleId: articleId,
  }).go();

  Dev.log('Article:', article.data);

  return article.data;
}

/**
 * Get a list of articles.
 * @param cursor The cursor to start from. Pass in no cursor to get the first page.
 */
export const getArticles = async (cursor?: string): Promise<PaginatedResponse<ArticleEntity>> =>
{
  Dev.log('Getting articles...', cursor);

  const articles = await Article.query.article({
  }).go({
    cursor: cursor,
    pages: 'all',
    limit: 25,
  });

  Dev.log('Articles:', articles.data, articles.cursor);

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

/**
 * Create a new article.
 */
export const createArticle = async (params: CreateArticleParams): Promise<ArticleEntity> =>
{
  Dev.log('Creating article...', params);

  const newArticle = await Article.create({
    articleId: genUuid(),
    ...params,
  }).go();

  Dev.log('New article:', newArticle.data);

  return newArticle.data;
}