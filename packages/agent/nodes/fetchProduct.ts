import { AgentState } from '../types';
import { fetchShopifyProduct } from '@core/shopify';

export async function fetchProduct(state: AgentState): Promise<AgentState> {
  state.products = [];
  for (const url of state.candidateUrls || []) {
    try {
      const prod = await fetchShopifyProduct(url);
      state.products.push(prod);
    } catch {
      // ignore
    }
  }
  return state;
}
