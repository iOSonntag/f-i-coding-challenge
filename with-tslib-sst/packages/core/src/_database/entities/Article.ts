import { Entity, EntityItem } from 'electrodb';
import { CommonFields } from '../models';
import { entityConfig } from '../entity-config';


export type ArticleEntity = EntityItem<typeof Article>;


export const Article = new Entity({
  model: {
    entity: 'Article',
    service: 'fichallenge',
    version: '1',
  },
  attributes: {
    articleId: {
      type: 'string',
      required: true,
    },
    name: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
    },
    price: {
      type: 'number',
      required: true,
    },
    currency: {
      type: 'string',
      required: true,
    },
    createdAt: CommonFields.createdAt,
    updatedAt: CommonFields.updatedAt,
  },
  indexes: {
    article: {
      pk: {
        field: 'pk',
        composite: [],
      },
      sk: {
        field: 'sk',
        composite: ['articleId'],
      },
    },
  },
}, entityConfig);