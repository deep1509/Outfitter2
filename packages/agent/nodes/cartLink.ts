import { AgentState } from '../types';
import { findVariant } from '@core/match';
import { buildCartPermalink } from '@core/shopify';

export async function cartLink(state: AgentState): Promise<AgentState> {
  const site = (process.env.ALLOWED_SHOPS || '').split(',')[0];
  state.suggestions = [];
  for (const prod of state.products || []) {
    const intentItem = state.intent?.items.find((i) => prod.title.toLowerCase().includes(i.category));
    const { variantId } = findVariant(prod, {
      color: intentItem?.color,
      size: intentItem?.size
    });
    if (variantId) {
      const cartUrl = buildCartPermalink(site, [variantId]);
      state.suggestions.push({ product: prod, variantId, cartUrl });
    }
  }
  return state;
}
