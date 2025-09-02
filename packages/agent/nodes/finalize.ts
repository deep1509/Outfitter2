import { AgentState } from '../types';

export async function finalize(state: AgentState): Promise<AgentState> {
  const count = state.suggestions?.length || 0;
  const message = count
    ? `I found ${count} items that match your request.`
    : 'I could not find matching items. Could you clarify your preferences?';
  state.messages.push({ role: 'assistant', content: message });
  return state;
}
