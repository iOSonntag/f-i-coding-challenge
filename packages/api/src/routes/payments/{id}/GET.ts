'use strict';

import { PaymentService } from '@app/core/services/payment-service';
import { ApiHub } from '@iosonntag/tslib-sst/api-code/api-hub';
import { usePathId } from '@iosonntag/tslib-sst/api-code/use-utilities/payload-data';
import { apiHubConfig } from 'src/_config/api-hub-config';

ApiHub.init(apiHubConfig);

export const handler = ApiHub.handlerREST(async () => 
{
  const paymentId = usePathId();

  const payment = await PaymentService.getPaymentById(paymentId);

  if (!payment) return 'RESOURCE_NOT_FOUND';

  return {
    success: true,
    data: payment,
  };
});




