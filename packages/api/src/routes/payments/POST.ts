'use strict';

import { PaymentService } from ':core/services/payment-service';
import { ApiHub } from ':tslib-sst/api-code/api-hub';
import { useValidatedPayload } from ':tslib-sst/api-code/use-utilities/payload-data';
import { apiHubConfig } from 'src/_config/api-hub-config';
import { useTerminalId } from 'src/utils/use-utillities';
import { z } from 'zod';

ApiHub.init(apiHubConfig);

const Payload = z.object({
  orderId: z.string().min(1),
});

export const handler = ApiHub.handlerREST(async () => 
{
  const terminalId = useTerminalId();
  const payload = useValidatedPayload(Payload);

  const response = await PaymentService.initiatePayment(terminalId, payload.orderId);
  
  return {
    success: true,
    data: response,
  };
});




