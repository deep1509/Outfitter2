import { AgentState } from '../types';
import { serperSearch } from '@services/serper';

const ALLOWED_SHOPS = process.env.ALLOWED_SHOPS?.split(',').filter(Boolean) ?? [];

export async function search(state: AgentState): Promise<AgentState> {
  const query = state.messages[state.messages.length - 1].content;
  const site = ALLOWED_SHOPS[0];
  state.candidateUrls = await serperSearch(query, site);
  state.debug?.push(`search: ${query} -> ${state.candidateUrls.length} urls`);
  return state;
}
