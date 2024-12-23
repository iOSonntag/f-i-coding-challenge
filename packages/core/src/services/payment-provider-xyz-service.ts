import { genUuid } from ':tslib-sst/api-code/use-utilities/value-generators';
import { Dev } from ':tslib-sst/api-code/utils/dev';



export * as PaymentProviderXYZService from './payment-provider-xyz-service';


export type PaymentPosition = {
  name: string;
  quantity: number;
  unitPrice: number;
  currency: string;
};

type CreatePaymentIntentParams = {
  /**
   * The reference ID of the payment. This is the ID of the order or payment in
   * your system. 
   */
  referenceId: string;
  positions: PaymentPosition[];
  /**
   * Optional custom data that you can pass to the payment provider. It will be
   * attached to the payment and can be used for reconciliation.
   */
  customData?: Record<string, any>;
};

type InitiatePaymentResponse = {
  providerPaymentId: string;
  paymentUrl: string;
};

/**
 * Create a payment intent with the payment provider. This will return a URL
 * that the client can use to complete the payment. It will also return the
 * payment ID of the payment in the payment provider's system.
 * 
 * Note that after the payment is completed, the client will receive a payment
 * reciept which can be used to verify the payment. The payment provider will
 * also call a webhook in your system to notify you about the payment.
 * This ensures that you can update the status of the payment in your system
 * regardless of connection issues with the client.
 */
export const createPaymentIntent = async (params: CreatePaymentIntentParams): Promise<InitiatePaymentResponse> =>
{
  // NOTE: This is a mock implementation. In a real-world scenario, you would
  // call the payment provider's API here.
  Dev.log('Create payment intent with provider XYZ...', params);

  const paymentId = genUuid();
  const paymentUrl = `https://managed-checkout.payment-provider-xyz.com/pay/${paymentId}`;

  Dev.log('Payment intent created:', paymentId, paymentUrl);

  return {
    providerPaymentId: paymentId,
    paymentUrl: paymentUrl,
  };
}