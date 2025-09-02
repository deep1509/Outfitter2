import { AgentState } from '../types';
import { serperSearch } from '@services/serper';
import { env } from '@web/lib/env';

export async function search(state: AgentState): Promise<AgentState> {
  const query = state.messages[state.messages.length - 1].content;
  const site = env.ALLOWED_SHOPS[0];
  state.candidateUrls = await serperSearch(query, site);
  return state;
}
