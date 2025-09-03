import { AgentState } from '../types';
import { findVariant } from '@core/match';
import { buildCartPermalink } from '@core/shopify';

export async function cartLink(state: AgentState): Promise<AgentState> {
  state.suggestions = [];
  for (const prod of state.products || []) {
    const intentItem = state.intent?.items.find((i) =>
      prod.title.toLowerCase().includes(i.category)
    );
    const { variantId } = findVariant(prod, {
      color: intentItem?.color,
      size: intentItem?.size,
    });
    if (variantId) {
      const site = new URL(prod.url).host;
      const cartUrl = buildCartPermalink(site, [variantId]);
      state.suggestions.push({ product: prod, variantId, cartUrl });
    }
  }
  state.debug?.push(`cartLink: ${state.suggestions.length} suggestions`);
  return state;
}
