'use strict';

import { OrderArticlesNotFoundError, OrderService } from ':core/services/order-service';
import { ApiHub } from ':tslib-sst/api-code/api-hub';
import { useHeader } from ':tslib-sst/api-code/sst-v2/api';
import { useValidatedPayload } from ':tslib-sst/api-code/use-utilities/payload-data';
import { apiHubConfig } from 'src/_config/api-hub-config';
import { useTerminalId } from 'src/utils/use-utillities';
import { z } from 'zod';

ApiHub.init(apiHubConfig);

const Payload = z.object({
  articles: z.array(z.object({
    articleId: z.string().min(1),
    quantity: z.number().int().min(1),
  })).min(1),
});

export const handler = ApiHub.handlerREST(async () => 
{
  const terminalId = useTerminalId();
  const payload = useValidatedPayload(Payload);

  try
  {
    const order = await OrderService.createOrder({
      terminalId: terminalId,
      articles: payload.articles,
    });

    return {
      success: true,
      data: order,
    };
  }
  catch (e)
  {
    if (e instanceof OrderArticlesNotFoundError)
    {
      return {
        success: false,
        error: {
          code: 'RESOURCE_NOT_FOUND',
          message: 'Some of the articles could not be found.',
          details: {
            articleIds: e.articleIds,
          },
        },
      };
    }

    throw e;
  }
});




