import { AgentState } from '../types';

export async function plan(state: AgentState): Promise<AgentState> {
  state.debug?.push('plan: noop');
  return state;
}
