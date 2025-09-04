import { Product } from '@core/types';

export type Message = { role: 'user' | 'assistant' | 'tool'; content: string };

export type AgentState = {
  messages: Message[];
  session: {
    size?: string;
    style?: string;
    budgetCents?: number;
    colorPrefs?: string[];
  };
  intent?: {
    categories: Array<'shirt' | 'pants' | 'cap' | 'sneakers'>;
    color?: string;
    size?: string;
    budgetCents?: number;
    upsell?: 'pants' | 'cap' | 'sneakers' | null;
  };
  candidates?: Product[];
  verified?: Product[];
  suggestions?: Array<{
    ordinal: number;
    product: Product;
    variantId: string;
    priceCents: number;
  }>;
  selectedVariantIds: string[];
  guardrailFindings?: { violations: string[]; passed: boolean; confidence: number };
  finalizedCartUrl?: string;
  stage?: string;
};
