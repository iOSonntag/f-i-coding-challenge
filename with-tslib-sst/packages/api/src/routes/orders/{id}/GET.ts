'use strict';

import { OrderService } from ':core/services/order-service';
import { ApiHub } from ':tslib-sst/api-code/api-hub';
import { usePathId } from ':tslib-sst/api-code/use-utilities/payload-data';
import { apiHubConfig } from 'src/_config/api-hub-config';

ApiHub.init(apiHubConfig);

export const handler = ApiHub.handlerREST(async () => 
{
  const orderId = usePathId();

  const order = await OrderService.getOrderById(orderId);

  return {
    success: true,
    data: order,
  };
});




