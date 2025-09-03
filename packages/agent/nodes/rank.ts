import { AgentState } from '../types';

export async function rank(state: AgentState): Promise<AgentState> {
  state.debug?.push('rank: passthrough');
  return state;
}
