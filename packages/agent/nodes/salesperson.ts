import { AgentState } from '../types';
import { extractIntent } from '@core/intent';

export async function salesperson(state: AgentState): Promise<AgentState> {
  if (!state.intent) {
    const last = state.messages[state.messages.length - 1];
    state.intent = extractIntent(last.content);
  }
  return state;
}
