import { AgentState } from '../types';
import { chat } from '@services/openai';

export async function finalize(state: AgentState): Promise<AgentState> {
  if (state.error) {
    const reply = 'I had trouble searching for products. Please verify your search API key and try again.';
    state.messages.push({ role: 'assistant', content: reply });
    return state;
  }

  const system = {
    role: 'system',
    content:
      'You are a friendly retail associate. Answer conversational questions and present verified products when available.',
  };
  const base = [system, ...state.messages];
  if (state.suggestions?.length) {
    const list = state.suggestions
      .map((s, i) => `${i + 1}. ${s.product.title} - ${s.cartUrl}`)
      .join('\n');
    base.push({
      role: 'system',
      content: `Recommend these products:\n${list}`,
    });
  } else {
    base.push({ role: 'system', content: 'Ask for clarifying details if needed.' });
  }
  let reply = '';
  try {
    reply = await chat(base);
    state.debug?.push('finalize: openai ok');
  } catch (err: any) {
    reply = state.suggestions?.length
      ? `I found ${state.suggestions.length} items that match your request.`
      : 'I could not find matching items. Could you clarify your preferences?';
    state.debug?.push(`finalize: openai fail ${err.message}`);
  }
  state.messages.push({ role: 'assistant', content: reply });
  return state;
}
