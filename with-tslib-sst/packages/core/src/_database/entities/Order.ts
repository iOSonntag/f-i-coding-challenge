import { CustomAttributeType, Entity, EntityItem } from 'electrodb';
import { CommonFields } from '../models';
import { entityConfig } from '../entity-config';
import { ArticleEntity } from './Article';


export type OrderEntity = EntityItem<typeof Order>;


export type OrderArticle = ArticleEntity & {
  quantity: number;
};

export const Order = new Entity({
  model: {
    entity: 'Order',
    service: 'fichallenge',
    version: '1',
  },
  attributes: {
    orderId: {
      type: 'string',
      required: true,
    },
    status: {
      type: ['PENDING', 'PAID', 'CANCELED'] as const,
      required: true,
      default: 'PENDING',
    },
    terminalId: {
      type: 'string',
      required: true,
    },
    articles: {
      type: 'list',
      items: {
        type: CustomAttributeType<OrderArticle>('any'),
      },
      required: true,
    },
    total: {
      type: 'map',
      required: true,
      properties: {
        amount: {
          type: 'number',
          required: true,
        },
        currency: {
          type: 'string',
          required: true,
        },
      },
    },
    createdAt: CommonFields.createdAt,
    updatedAt: CommonFields.updatedAt,
    paidAt: {
      type: 'string',
    },
  },
  indexes: {
    order: {
      pk: {
        field: 'pk',
        composite: ['orderId'],
      },
      sk: {
        field: 'sk',
        composite: ['orderId'],
      },
    },
  },
}, entityConfig);