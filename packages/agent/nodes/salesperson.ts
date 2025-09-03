import { AgentState } from '../types';
import { extractIntent } from '@core/intent';

export async function salesperson(state: AgentState): Promise<AgentState> {
  const last = state.messages[state.messages.length - 1];
  if (!state.intent) {
    state.intent = extractIntent(last.content);
  }
  state.debug?.push(`salesperson: intent=${JSON.stringify(state.intent)}`);
  return state;
}
