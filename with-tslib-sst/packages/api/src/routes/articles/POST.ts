'use strict';

import { ArticleService } from ':core/services/article-service';
import { ApiHub } from ':tslib-sst/api-code/api-hub';
import { useValidatedPayload } from ':tslib-sst/api-code/use-utilities/payload-data';
import { apiHubConfig } from 'src/_config/api-hub-config';
import { z } from 'zod';

ApiHub.init(apiHubConfig);

const Payload = z.object({
  name: z.string().min(1).max(64),
  description: z.string().max(512).optional(),
  price: z.number().gt(0),
  currency: z.enum(['EUR']),
});

export const handler = ApiHub.handlerREST(async () => 
{
  const payload = useValidatedPayload(Payload);

  const article = await ArticleService.createArticle(payload);

  return {
    success: true,
    data: article,
  };
});




