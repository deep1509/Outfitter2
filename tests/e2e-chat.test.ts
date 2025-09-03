import { describe, it, expect, vi } from 'vitest';
import { runAgent } from '../packages/agent/graph.js';
import { Product } from '../packages/core/types.js';

const shirt: Product = {
  id: 'p1',
  title: 'Crimson Tee',
  handle: 'crimson-tee',
  url: 'https://culturekings.com.au/products/crimson-tee',
  tags: ['shirt'],
  priceCents: 5000,
  images: [],
  variants: [
    {
      id: '111',
      priceCents: 5000,
      available: true,
      options: [
        { name: 'Color', value: 'Crimson' },
        { name: 'Size', value: 'M' }
      ]
    }
  ]
};

const pants: Product = {
  id: 'p2',
  title: 'Red Cargo Pants',
  handle: 'red-cargo',
  url: 'https://culturekings.com.au/products/red-cargo',
  tags: ['pants'],
  priceCents: 7000,
  images: [],
  variants: [
    {
      id: '222',
      priceCents: 7000,
      available: true,
      options: [
        { name: 'Color', value: 'Red' },
        { name: 'Size', value: 'M' }
      ]
    }
  ]
};

vi.mock('../packages/services/serper.js', () => ({
  serperSearch: vi.fn(async () => [
    'https://culturekings.com.au/products/crimson-tee',
    'https://culturekings.com.au/products/red-cargo'
  ])
}));

vi.mock('../packages/core/shopify.js', () => ({
  buildCartPermalink: (domain: string, ids: string[]) => `https://${domain}/cart/${ids.map((id) => `${id}:1`).join(',')}`,
  fetchShopifyProduct: vi.fn(async (url: string) => {
    if (url.includes('crimson-tee')) return shirt;
    return pants;
  })
}));

describe('e2e chat', () => {
  it('returns suggestions with cart links', async () => {
    const res = await runAgent([
      { role: 'user', content: 'I want a red shirt and matching cargo trousers, size M, budget $150.' }
    ]);
    expect(res.suggestions?.length).toBe(2);
    expect(res.suggestions?.[0].cartUrl).toMatch(/cart\/111:1/);
    expect(res.suggestions?.[1].cartUrl).toMatch(/cart\/222:1/);
  });
});
