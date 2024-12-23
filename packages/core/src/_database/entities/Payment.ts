import { Entity, EntityItem } from 'electrodb';
import { CommonFields } from '../models';
import { entityConfig } from '../entity-config';


export type PaymentEntity = EntityItem<typeof Payment>;

export const PaymentStatusTypes = ['INITIATED', 'PAID', 'CANCELED', 'PAYMENT_FAILED', 'TIMEOUT'] as const;
export type PaymentStatusType = typeof PaymentStatusTypes[number];

export const Payment = new Entity({
  model: {
    entity: 'Payment',
    service: 'fichallenge',
    version: '1',
  },
  attributes: {
    paymentId: {
      type: 'string',
      required: true,
    },
    status: {
      type: PaymentStatusTypes,
      required: true,
      default: 'INITIATED',
    },
    orderId: {
      type: 'string',
      required: true,
    },
    provider: {
      type: 'string',
      required: true,
    },
    providerPaymentId: {
      type: 'string',
    },
    paymentMethod: {
      type: 'string',
      required: true,
      default: 'NOT_CHOSEN_YET',
    },
    total: {
      type: 'map',
      required: true,
      properties: {
        amount: {
          type: 'number',
          required: true,
        },
        currency: {
          type: 'string',
          required: true,
        },
      },
    },
    providerFee: {
      type: 'map',
      properties: {
        amount: {
          type: 'number',
          required: true,
        },
        currency: {
          type: 'string',
          required: true,
        },
      },
    },
    createdAt: CommonFields.createdAt,
    updatedAt: CommonFields.updatedAt,
  },
  indexes: {
    payment: {
      pk: {
        field: 'pk',
        composite: ['paymentId'],
      },
      sk: {
        field: 'sk',
        composite: ['paymentId'],
      },
    },
  },
}, entityConfig);