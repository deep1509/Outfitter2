import { AgentState, Message } from './types';
import { salesperson } from './nodes/salesperson';
import { plan } from './nodes/plan';
import { search } from './nodes/search';
import { fetchProduct } from './nodes/fetchProduct';
import { verify } from './nodes/verify';
import { rank } from './nodes/rank';
import { cartLink } from './nodes/cartLink';
import { finalize } from './nodes/finalize';

export async function runAgent(messages: Message[]) {
  let state: AgentState = { messages };
  state = await salesperson(state);
  state = await plan(state);
  state = await search(state);
  state = await fetchProduct(state);
  state = await verify(state);
  state = await rank(state);
  state = await cartLink(state);
  state = await finalize(state);
  const last = state.messages[state.messages.length - 1];
  return { message: last.content, suggestions: state.suggestions };
}
