import { describe, it, expect, vi } from 'vitest';
import { runAgent } from '../packages/agent/graph.js';
import { AgentState } from '../packages/agent/types.js';
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
  serperSearch: vi.fn(async (query: string) => {
    if (/pant/.test(query)) return ['https://culturekings.com.au/products/red-cargo'];
    return ['https://culturekings.com.au/products/crimson-tee'];
  })
}));

vi.mock('../packages/core/shopify.js', () => ({
  buildCartPermalink: (domain: string, ids: string[]) => `https://${domain}/cart/${ids.map(id => `${id}:1`).join(',')}`,
  fetchShopifyProduct: vi.fn(async (url: string) => {
    if (url.includes('crimson-tee')) return shirt;
    return pants;
  })
}));

describe('e2e upsell', () => {
  it('builds combined cart after upsell', async () => {
    let state: AgentState = { messages: [], session: {}, selectedVariantIds: [] } as any;
    state.messages.push({ role: 'user', content: 'Looking for a red shirt in size M' });
    state = await runAgent(state);
    expect(state.suggestions?.length).toBe(1);
    state.messages.push({ role: 'user', content: 'option 1' });
    state = await runAgent(state);
    expect(state.stage).toBe('upsell_prompt');
    state.messages.push({ role: 'user', content: 'yes' });
    state = await runAgent(state);
    expect(state.suggestions?.[0].product.title).toContain('Cargo');
    state.messages.push({ role: 'user', content: '1' });
    state = await runAgent(state);
    state.messages.push({ role: 'user', content: 'done' });
    state = await runAgent(state);
    expect(state.finalizedCartUrl).toBe('https://culturekings.com.au/cart/111:1,222:1');
  });
});
