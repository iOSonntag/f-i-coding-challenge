'use strict';

import { ArticleService } from '@app/core/services/article-service';
import { ApiHub } from '@iosonntag/tslib-sst/api-code/api-hub';
import { useQueryParam } from '@iosonntag/tslib-sst/api-code/sst-v2/api';
import { apiHubConfig } from 'src/_config/api-hub-config';

ApiHub.init(apiHubConfig);

export const handler = ApiHub.handlerREST(async () => 
{
  const cursor = useQueryParam('cursor');

  const articles = await ArticleService.getArticles(cursor);

  return {
    success: true,
    data: articles,
  };
});




