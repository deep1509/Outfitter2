import { Intent, Product, Suggestion } from '@core/types';

export type Message = { role: 'user' | 'assistant' | 'tool'; content: string };

export type AgentState = {
  messages: Message[];
  intent?: Intent;
  candidateUrls?: string[];
  products?: Product[];
  suggestions?: Suggestion[];
  guardrailFindings?: { violations: string[]; passed: boolean };
  debug?: string[];
};
