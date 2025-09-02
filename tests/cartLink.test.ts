import { describe, it, expect } from 'vitest';
import { buildCartPermalink } from '@core/shopify';

describe('cart link', () => {
  it('builds culture kings url', () => {
    const url = buildCartPermalink('culturekings.com.au', ['123', '456']);
    expect(url).toBe('https://culturekings.com.au/cart/123:1,456:1');
  });
});
