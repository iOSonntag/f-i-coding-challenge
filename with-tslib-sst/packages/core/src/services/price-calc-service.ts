

import Decimal from 'decimal.js';

export * as PriceCalcService from './price-calc-service';


export type ItemPosition = {
  quantity: number;
  price: number;
  currency: string;
}

/**
 * Calculate total amount of the order using provided positions. It does so by
 * leveraging Decimal.js library in order to ensure precision of the calculations.
 */
export const calculateTotal = (positions: ItemPosition[]): { amount: number, currency: string } =>
{
  let total = new Decimal(0);

  for (const position of positions)
  {
    if (position.currency !== 'EUR')
    {
      throw new Error('Only EUR currency is supported');
    }

    const positionTotal = new Decimal(position.price).times(position.quantity);
    total = total.plus(positionTotal);
  }

  return {
    amount: total.toNumber(),
    currency: 'EUR',
  };
}