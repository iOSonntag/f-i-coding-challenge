'use strict';

import { OrderService } from '@app/core/services/order-service';
import { ApiHub } from '@iosonntag/tslib-sst/api-code/api-hub';
import { usePathId } from '@iosonntag/tslib-sst/api-code/use-utilities/payload-data';
import { apiHubConfig } from 'src/_config/api-hub-config';

ApiHub.init(apiHubConfig);

export const handler = ApiHub.handlerREST(async () => 
{
  const orderId = usePathId();

  const order = await OrderService.getOrderById(orderId);

  if (!order) return 'RESOURCE_NOT_FOUND';

  return {
    success: true,
    data: order,
  };
});




