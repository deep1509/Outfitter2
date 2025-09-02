import { AgentState } from '../types';

export async function plan(state: AgentState): Promise<AgentState> {
  // Stage 1: no-op planner
  return state;
}
