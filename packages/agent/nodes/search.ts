import { AgentState } from '../types';
import { serperSearch } from '@services/serper';

const ALLOWED_SHOPS = (process.env.ALLOWED_SHOPS || 'culturekings.com.au')
  .split(',')
  .map((h) => h.trim().replace(/^www\./, ''))
  .filter(Boolean);

export async function search(state: AgentState): Promise<AgentState> {
  const query = state.searchQuery;
  const site = ALLOWED_SHOPS[0];
  if (!query) {
    state.candidateUrls = [];
    state.debug?.push('search: skipped');
    return state;
  }
  try {
    const urls = await serperSearch(query, site);
    state.candidateUrls = urls.filter((u) => {
      const parsed = new URL(u);
      const host = parsed.host.replace(/^www\./, '');
      const isAllowedHost = ALLOWED_SHOPS.includes(host);
      const isProduct = /\/products\//.test(parsed.pathname);
      return isAllowedHost && isProduct;
    });
    state.debug?.push(
      `search: ${query} -> ${state.candidateUrls.length} urls`
    );
  } catch (err: any) {
    state.candidateUrls = [];
    state.error = 'search_failed';
    state.debug?.push(`search error: ${err.message}`);
  }
  return state;
}
