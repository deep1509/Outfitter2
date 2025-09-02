import { describe, it, expect, vi } from 'vitest';
import { POST } from '@web/app/api/chat/route';
import { Product } from '@core/types';

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

vi.mock('@services/serper', () => ({
  serperSearch: vi.fn(async () => [
    'https://culturekings.com.au/products/crimson-tee',
    'https://culturekings.com.au/products/red-cargo'
  ])
}));

vi.mock('@core/shopify', () => ({
  buildCartPermalink: (domain: string, ids: string[]) => `https://${domain}/cart/${ids.map((id) => `${id}:1`).join(',')}`,
  fetchShopifyProduct: vi.fn(async (url: string) => {
    if (url.includes('crimson-tee')) return shirt;
    return pants;
  })
}));

describe('e2e chat', () => {
  it('returns suggestions with cart links', async () => {
    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ messages: [{ role: 'user', content: 'I want a red shirt and matching cargo trousers, size M, budget $150.' }] })
    });
    const res = await POST(req as any);
    const data = await res.json();
    expect(data.suggestions.length).toBe(2);
    expect(data.suggestions[0].cartUrl).toMatch(/cart\/111:1/);
    expect(data.suggestions[1].cartUrl).toMatch(/cart\/222:1/);
  });
});
