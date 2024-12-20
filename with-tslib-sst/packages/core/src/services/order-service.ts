import { genUuid } from ':tslib-sst/api-code/use-utilities/value-generators';
import { Order, OrderArticle, OrderEntity } from '../_database/entities/Order';
import { ArticleService } from './article-service';
import { ItemPosition, PriceCalcService } from './price-calc-service';



export * as OrderService from './order-service';

type OrderArticleSlim = {
  articleId: string;
  quantity: number;
};

type CreateOrderParams = {
  terminalId: string;
  articles: OrderArticleSlim[];
};


export class OrderArticlesNotFoundError extends Error {

  public articleIds: string[];

  constructor(articleIds: string[])
  {
    super(`Order articles not found: ${articleIds.join(', ')}`);
    this.name = 'OrderArticlesNotFoundError';
    this.articleIds = articleIds;
  }
}


export const getOrderById = async (orderId: string): Promise<OrderEntity | null> =>
{
  const order = await Order.get({
    orderId: orderId,
  }).go();

  return order.data;
}

export const createOrder = async (params: CreateOrderParams): Promise<OrderEntity> =>
{
  const mergedArticles = mergeArticles(params.articles);

  const articleEntities = await Promise.all(mergedArticles.map(article => ArticleService.getArticleById(article.articleId)));
  const missingArticles: string[] = [];

  for (let i = 0; i < mergedArticles.length; i++)
  {
    if (!articleEntities[i])
    {
      missingArticles.push(mergedArticles[i].articleId);
    }
  }

  if (missingArticles.length > 0)
  {
    throw new OrderArticlesNotFoundError(missingArticles);
  }

  const orderArticles: OrderArticle[] = mergedArticles.map((article, i) => ({
    ...articleEntities[i]!,
    quantity: article.quantity,
  }));

  const total = PriceCalcService.calculateTotal(orderArticles);

  // Create the order
  const response = await Order.create({
    orderId: genUuid(),
    terminalId: params.terminalId,
    articles: orderArticles,
    total: total,
  }).go();

  return response.data;
}

const mergeArticles = (articles: OrderArticleSlim[]): OrderArticleSlim[] =>
{
  const result: Record<string, OrderArticleSlim> = {};

  for (const article of articles)
  {
    const existing = result[article.articleId];

    if (existing)
    {
      result[article.articleId] = {
        ...existing,
        quantity: existing.quantity + article.quantity,
      };
    }
    else
    {
      result[article.articleId] = article;
    }
  }

  return Object.values(result);
}