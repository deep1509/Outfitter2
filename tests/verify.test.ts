import { describe, it, expect } from 'vitest';
import { verifyProducts } from '@agent/nodes/verify';
import { Product } from '@core/types';

const baseProduct: Product = {
  id: '1',
  title: 'Crimson Tee',
  handle: 'crimson-tee',
  url: 'https://culturekings.com.au/products/crimson-tee',
  tags: ['shirt'],
  priceCents: 2000,
  images: [],
  variants: [
    {
      id: 'v1',
      priceCents: 2000,
      available: true,
      options: [
        { name: 'Color', value: 'Crimson' },
        { name: 'Size', value: 'M' }
      ]
    }
  ]
};

describe('verify', () => {
  it('rejects wrong category', () => {
    const prod = { ...baseProduct, title: 'Blue Jacket', url: 'https://culturekings.com.au/products/blue-jacket', tags: ['jacket'] };
    const intent = { items: [{ category: 'shirt', color: 'red', size: 'M' }] } as any;
    const res = verifyProducts([prod], intent, { allowedHosts: ['culturekings.com.au'] });
    expect(res.passed).toBe(false);
  });

  it('accepts proper red shirt', () => {
    const intent = { items: [{ category: 'shirt', color: 'red', size: 'M', budgetCents: 3000 }] } as any;
    const res = verifyProducts([baseProduct], intent, { allowedHosts: ['culturekings.com.au'] });
    expect(res.passed).toBe(true);
  });
});
