import { genIsoTimestamp, genUuid } from ':tslib-sst/api-code/use-utilities/value-generators';
import { Order, OrderArticle, OrderEntity, OrderStatusType } from '../_database/entities/Order';
import { ArticleService } from './article-service';
import { ItemPosition, PriceCalcService } from './price-calc-service';
import { Dev } from ':tslib-sst/api-code/utils/dev';



export * as OrderService from './order-service';

type OrderArticleIdOnly = {
  articleId: string;
  quantity: number;
};

type CreateOrderParams = {
  terminalId: string;
  articles: OrderArticleIdOnly[];
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


/**
 * Update the status of an order. If the status is `'PAID'`, the `paidAt` field
 * will be set to the current time. 
 * 
 * @returns The updated order.
 */
export const updateOrderStatus = async (orderId: string, status: OrderStatusType): Promise<OrderEntity> =>
{
  Dev.log('Updating order status...', orderId, status);

  const order = await Order.patch({
    orderId: orderId,
  })
  .data((attr, op) => 
  {
    op.set(attr.status, status);

    if (status === 'PAID')
    {
      Dev.log('Setting paidAt...');

      op.set(attr.paidAt, genIsoTimestamp());
    }
  })
  .go({
    response: 'all_new',
  });

  Dev.log('Updated order:', order.data);

  return order.data;
}


/**
 * Get an order by its ID. Returns `null` if no order is found.
 */
export const getOrderById = async (orderId: string): Promise<OrderEntity | null> =>
{
  Dev.log('Getting order by ID...', orderId);

  const order = await Order.get({
    orderId: orderId,
  }).go();

  Dev.log('Order:', order.data);

  return order.data;
}

/**
 * Create a new order.
 */
export const createOrder = async (params: CreateOrderParams): Promise<OrderEntity> =>
{
  Dev.log('Creating order...', params);

  Dev.log('Merging articles...');
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
    Dev.logIssue('Missing articles:', missingArticles);

    throw new OrderArticlesNotFoundError(missingArticles);
  }

  const orderArticles: OrderArticle[] = mergedArticles.map((article, i) => ({
    ...articleEntities[i]!,
    quantity: article.quantity,
  }));

  const total = PriceCalcService.calculateTotal(orderArticles);

  // Create the order
  Dev.log('Creating order in database...');

  const response = await Order.create({
    orderId: genUuid(),
    terminalId: params.terminalId,
    articles: orderArticles,
    total: total,
  }).go();

  Dev.log('Created order:', response.data);

  return response.data;
}

/**
 * Merge articles with the same ID in a list of articles and add up their
 * quantities.
 */
const mergeArticles = (articles: OrderArticleIdOnly[]): OrderArticleIdOnly[] =>
{
  const result: Record<string, OrderArticleIdOnly> = {};

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