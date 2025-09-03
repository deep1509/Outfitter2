import { AgentState } from '../types';

export async function plan(state: AgentState): Promise<AgentState> {
  const item = state.intent?.items[0];
  if (item) {
    const parts = [item.color, item.category, item.size].filter(Boolean);
    state.searchQuery = parts.join(' ');
    state.debug?.push(`plan: search="${state.searchQuery}"`);
  } else {
    state.searchQuery = undefined;
    state.debug?.push('plan: noop');
  }
  return state;
}
