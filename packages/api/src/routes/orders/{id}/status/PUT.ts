'use strict';

import { OrderStatusTypes } from ':core/_database/entities/Order';
import { OrderService } from ':core/services/order-service';
import { ApiHub } from ':tslib-sst/api-code/api-hub';
import { usePathId, useValidatedPayload } from ':tslib-sst/api-code/use-utilities/payload-data';
import { apiHubConfig } from 'src/_config/api-hub-config';
import { z } from 'zod';

ApiHub.init(apiHubConfig);

const Payload = z.object({
  status: z.enum(OrderStatusTypes),
});

export const handler = ApiHub.handlerREST(async () => 
{
  const orderId = usePathId();
  const payload = useValidatedPayload(Payload);

  const updatedOrder = await OrderService.updateOrderStatus(orderId, payload.status);

  return {
    success: true,
    data: updatedOrder,
  };
});




