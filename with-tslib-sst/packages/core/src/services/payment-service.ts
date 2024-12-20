import { genUuid } from ':tslib-sst/api-code/use-utilities/value-generators';
import { OrderService } from './order-service';
import { Payment, PaymentEntity } from '../_database/entities/Payment';
import { PaymentProviderXYZService } from './payment-provider-xyz-service';
import { Dev } from ':tslib-sst/api-code/utils/dev';



export * as PaymentService from './payment-service';


export const getPaymentById = async (paymentId: string): Promise<PaymentEntity | null> =>
{
  const response = await Payment.get({
    paymentId: paymentId,
  }).go();

  return response.data;
}

type InitiatePaymentResponse = {
  paymentId: string;
  externalPaymentId: string;
  paymentUrl: string;
};

export const initiatePayment = async (terminalId: string, orderId: string): Promise<InitiatePaymentResponse> =>
{
  const order = await OrderService.getOrderById(orderId);

  if (!order)
  {
    throw new Error('Order not found');
  }

  const ourPaymentId = genUuid();

  await Payment.create({
    paymentId: ourPaymentId,
    orderId: orderId,
    provider: 'XYZ',
    total: order.total,
  }).go();

  const providerResponse = await PaymentProviderXYZService.initiatePayment({
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

    Dev.logIssue('Payment provider payment id storing failed', e);
  }

  return {
    paymentId: ourPaymentId,
    externalPaymentId: providerResponse.providerPaymentId,
    paymentUrl: providerResponse.paymentUrl,
  };
}