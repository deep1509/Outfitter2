import { describe, it, expect } from 'vitest';
import { findVariant } from '@core/match';
import { Product } from '@core/types';

describe('match', () => {
  const product: Product = {
    id: '1',
    title: 'Crimson Tee',
    handle: 'crimson-tee',
    url: 'u',
    priceCents: 2000,
    variants: [
      { id: 'v1', priceCents: 2000, available: true, options: [ {name:'Color', value:'Crimson'}, {name:'Size', value:'Medium'} ] }
    ]
  };

  it('maps red to crimson', () => {
    const { variantId } = findVariant(product, { color: 'red', size: 'M' });
    expect(variantId).toBe('v1');
  });

  it('handles size synonym', () => {
    const { variantId } = findVariant(product, { size: 'medium' });
    expect(variantId).toBe('v1');
  });
});
