import { genUuid } from ':tslib-sst/api-code/use-utilities/value-generators';
import { OrderService } from './order-service';
import { Payment, PaymentEntity } from '../_database/entities/Payment';
import { PaymentProviderXYZService } from './payment-provider-xyz-service';
import { Dev } from ':tslib-sst/api-code/utils/dev';



export * as PaymentService from './payment-service';

/**
 * Get a payment by its ID. Returns null if no payment is found.
 */
export const getPaymentById = async (paymentId: string): Promise<PaymentEntity | null> =>
{
  Dev.log('Getting payment by ID...', paymentId);

  const response = await Payment.get({
    paymentId: paymentId,
  }).go();

  Dev.log('Payment:', response.data);

  return response.data;
}

type InitiatePaymentResponse = {
  paymentId: string;
  externalPaymentId: string;
  paymentUrl: string;
};

/**
 * Initiate a payment for an order. This will create a payment in our system
 * and request a payment intent from the payment provider.
 * 
 * @returns The payment ID of the payment in our system, the payment ID of the
 * payment in the external payment provider system, and the URL that the client
 * can use to complete the payment.
 */
export const initiatePayment = async (terminalId: string, orderId: string): Promise<InitiatePaymentResponse> =>
{
  Dev.log('Initiating payment...', terminalId, orderId);

  const order = await OrderService.getOrderById(orderId);

  if (!order)
  {
    Dev.logIssue('Order not found', orderId);

    throw new Error('Order not found');
  }

  const ourPaymentId = genUuid();

  Dev.log('Creating payment...', ourPaymentId);

  await Payment.create({
    paymentId: ourPaymentId,
    orderId: orderId,
    provider: 'XYZ',
    total: order.total,
  }).go();

  const providerResponse = await PaymentProviderXYZService.createPaymentIntent({
    // Here we inform the payment provider about the payment reference ID that
    // we use in our system. This will allow us to match the payment in our
    // system once we receive a payment confirmation from the payment provider.
    referenceId: ourPaymentId,
    positions: order.articles.map(article => ({
      name: article.name,
      quantity: article.quantity,
      unitPrice: article.price,
      currency: article.currency,
    })),
    // Here we specify custom data that we want to store with the payment in the
    // external payment provider service.
    customData: {
      orderId: orderId,
      terminalId: terminalId,
      paymentId: ourPaymentId,
    },
  });

  try
  {
    Dev.log('Storing payment provider payment ID...', providerResponse.providerPaymentId);

    await Payment.patch({
      paymentId: ourPaymentId,
    })
    .set({
      providerPaymentId: providerResponse.providerPaymentId,
    })
    .go();
  }
  catch (e)
  {
    // NOTE: We allow this operation to fail because we already submitted our
    // own payment id to the payment provider. We can still match the payment in
    // our system once we receive a payment confirmation from the payment
    // provider.
    // After we receive the payment confirmation, either via webhook or by
    // validating a client submitted payment receipt, we will ensure that the
    // external payment provider payment id is stored in our system. But for now
    // we can just ignore any errors that occur here.

    Dev.logIssue('Payment provider payment ID storing failed', e);
  }

  Dev.log('Payment initiated:', ourPaymentId, providerResponse.providerPaymentId, providerResponse.paymentUrl);

  return {
    paymentId: ourPaymentId,
    externalPaymentId: providerResponse.providerPaymentId,
    paymentUrl: providerResponse.paymentUrl,
  };
}