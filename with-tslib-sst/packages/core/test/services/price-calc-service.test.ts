import { expect, test } from 'vitest';
import { PriceCalcService } from '../../src/services/price-calc-service';




test('calculating a total of a single item of 99.01 EUR should be 99.01 EUR', () =>
{
  expect(PriceCalcService.calculateTotal([
    {
      price: 99.01,
      quantity: 1,
      currency: 'EUR'
    },
  ])).toStrictEqual({
    amount: 99.01,
    currency: 'EUR'
  })
});

test('calculating a total of two items with 0.1 EUR and 0.2 EUR should be 0.3 EUR and not 0.30000000000000004 EUR', () =>
{
  expect(PriceCalcService.calculateTotal([
    {
      price: 0.1,
      quantity: 1,
      currency: 'EUR'
    },
    {
      price: 0.2,
      quantity: 1,
      currency: 'EUR'
    },
  ])).toStrictEqual({
    amount: 0.3,
    currency: 'EUR'
  })
});


test('calculating a total of two items with 0.99999999 EUR and 0.00000001 EUR should be 1.0', () =>
{
  expect(PriceCalcService.calculateTotal([
    {
      price: 0.99999999,
      quantity: 1,
      currency: 'EUR'
    },
    {
      price: 0.00000001,
      quantity: 1,
      currency: 'EUR'
    },
  ])).toStrictEqual({
    amount: 1.0,
    currency: 'EUR'
  })
});

test('calculating a total of the following items should be 30,75 EUR', () =>
{
  expect(PriceCalcService.calculateTotal([
    {
      price: 0.1,
      quantity: 3,
      currency: 'EUR'
    },
    {
      price: 1.29,
      quantity: 2,
      currency: 'EUR'
    },
    {
      price: 9.29,
      quantity: 3,
      currency: 'EUR'
    },
  ])).toStrictEqual({
    amount: 30.75,
    currency: 'EUR'
  })
});

test('calculating a total of items including one ore more with a different currency than EUR should fail', () =>
{
  expect(() => PriceCalcService.calculateTotal([
    {
      price: 0.99,
      quantity: 3,
      currency: 'EUR'
    },
    {
      price: 2.99,
      quantity: 1,
      currency: 'EUR'
    },
    {
      price: 1.99,
      quantity: 1,
      currency: 'USD'
    },
  ])).toThrowError(Error);
});