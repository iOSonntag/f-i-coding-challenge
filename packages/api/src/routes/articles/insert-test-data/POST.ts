'use strict';

import { ArticleService } from ':core/services/article-service';
import { ApiHub } from ':tslib-sst/api-code/api-hub';
import { apiHubConfig } from 'src/_config/api-hub-config';

ApiHub.init(apiHubConfig);

export const handler = ApiHub.handlerREST(async () => 
{
  await Promise.all([
    ArticleService.createArticle({
      name: 'Super Cheap Snack',
      description: 'A snack that is super cheap and delicious!',
      price: 29.99,
      currency: 'EUR',
    }),
    ArticleService.createArticle({
      name: 'AMANDA Motor Oil',
      description: 'The only motor oil that makes your car go wild!',
      price: 49.99,
      currency: 'EUR',
    }),
    ArticleService.createArticle({
      name: 'No Name Motor Oil',
      description: 'Is the same as any other motor oil, but cheaper!',
      price: 2.99,
      currency: 'EUR',
    }),
    ArticleService.createArticle({
      name: 'Hot Dog',
      description: 'A tasty hot dog!',
      price: 3.49,
      currency: 'EUR',
    }),
    ArticleService.createArticle({
      name: 'Coffee',
      description: 'A cup of coffee!',
      price: 5.99,
      currency: 'EUR',
    }),
    ArticleService.createArticle({
      name: 'Cola',
      description: '1L of Cola!',
      price: 3.99,
      currency: 'EUR',
    }),
  ]);

  return 'SUCCESS';
});




