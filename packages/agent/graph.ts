import { AgentState } from './types.js';
import { extractIntent } from '../core/intent.js';
import { serperSearch } from '../services/serper.js';
import { fetchShopifyProduct, buildCartPermalink } from '../core/shopify.js';
import { verifyProducts } from './nodes/verify.js';
import { findVariant } from '../core/match.js';
import { parseSelection } from './nodes/parseSelection.js';
import { Intent, Product } from '../core/types.js';

const ALLOWED_HOST = 'culturekings.com.au';

async function discoverProducts(opts: { category: string; color?: string; size?: string; budgetCents?: number }): Promise<AgentState['suggestions']> {
  const query = [opts.color, opts.category, opts.size].filter(Boolean).join(' ');
  const urls = await serperSearch(query, ALLOWED_HOST);
  const products: Product[] = [];
  for (const url of urls) {
    try {
      products.push(await fetchShopifyProduct(url));
    } catch {
      // ignore
    }
  }
  const intent: Intent = { items: [{ category: opts.category as any, color: opts.color, size: opts.size, budgetCents: opts.budgetCents }] };
  const res = verifyProducts(products, intent, { allowedHosts: [ALLOWED_HOST] });
  const suggestions = res.products.slice(0, 3).map((p, i) => {
    const { variantId } = findVariant(p, { color: opts.color, size: opts.size });
    return {
      ordinal: i + 1,
      product: p,
      variantId: variantId!,
      priceCents: p.variants.find((v) => v.id === variantId)?.priceCents || p.priceCents,
    };
  });
  return suggestions;
}

export async function runAgent(state: AgentState): Promise<AgentState> {
  state.selectedVariantIds = state.selectedVariantIds || [];
  state.session = state.session || {};

  const last = state.messages[state.messages.length - 1];
  const content = last.content.toLowerCase();

  switch (state.stage) {
    case undefined:
    case 'start': {
      const intent = extractIntent(content);
      const first = intent.items[0];
      state.intent = {
        categories: first ? [first.category as any] : [],
        color: first?.color,
        size: first?.size,
        budgetCents: first?.budgetCents,
        upsell: null,
      };
      if (first?.size) state.session.size = first.size;
      if (first?.color) state.session.colorPrefs = [first.color];
      if (first?.budgetCents) state.session.budgetCents = first.budgetCents;
      const suggestions = await discoverProducts({ category: first!.category, color: first?.color, size: first?.size, budgetCents: first?.budgetCents });
      state.suggestions = suggestions;
      state.stage = 'awaiting_selection';
      const list = suggestions.map((s) => `${s.ordinal}. ${s.product.title}`).join('\n');
      state.messages.push({ role: 'assistant', content: `Hey! Here are some options:\n${list}\nWhich do you like?` });
      return state;
    }
    case 'awaiting_selection': {
      const picks = parseSelection(content, state.suggestions?.length);
      const valids = picks.filter((n) => state.suggestions?.some((s) => s.ordinal === n));
      if (!valids.length) {
        state.messages.push({ role: 'assistant', content: 'Please pick a number from the list.' });
        return state;
      }
      for (const n of valids) {
        const sug = state.suggestions!.find((s) => s.ordinal === n)!;
        state.selectedVariantIds.push(sug.variantId);
      }
      state.suggestions = undefined;
      state.stage = 'upsell_prompt';
      state.messages.push({ role: 'assistant', content: 'Nice pick! Want me to pull a matching cargo trouser?' });
      return state;
    }
    case 'upsell_prompt': {
      if (/(yes|sure|yep|ok)/.test(content)) {
        const color = state.session.colorPrefs?.[0];
        const size = state.session.size;
        const suggestions = await discoverProducts({ category: 'pants', color, size, budgetCents: state.session.budgetCents });
        state.suggestions = suggestions;
        state.stage = 'awaiting_upsell_selection';
        const list = suggestions.map((s) => `${s.ordinal}. ${s.product.title}`).join('\n');
        state.messages.push({ role: 'assistant', content: `Here are some options:\n${list}\nWhich ones do you like?` });
        return state;
      } else {
        state.finalizedCartUrl = buildCartPermalink(ALLOWED_HOST, state.selectedVariantIds);
        state.stage = 'finalized';
        state.messages.push({ role: 'assistant', content: `All set! ${state.finalizedCartUrl}` });
        return state;
      }
    }
    case 'awaiting_upsell_selection': {
      const picks = parseSelection(content, state.suggestions?.length);
      const valids = picks.filter((n) => state.suggestions?.some((s) => s.ordinal === n));
      if (!valids.length) {
        state.messages.push({ role: 'assistant', content: 'Please pick a number from the list.' });
        return state;
      }
      for (const n of valids) {
        const sug = state.suggestions!.find((s) => s.ordinal === n)!;
        state.selectedVariantIds.push(sug.variantId);
      }
      state.suggestions = undefined;
      state.stage = 'awaiting_final';
      state.messages.push({ role: 'assistant', content: "Great! Say 'done' when you're ready to checkout." });
      return state;
    }
    case 'awaiting_final': {
      if (/done|checkout|finish|final|that\'s all|im done|that's all/.test(content)) {
        state.finalizedCartUrl = buildCartPermalink(ALLOWED_HOST, state.selectedVariantIds);
        state.stage = 'finalized';
        state.messages.push({ role: 'assistant', content: `Here you go: ${state.finalizedCartUrl}` });
        return state;
      } else {
        state.messages.push({ role: 'assistant', content: "Let me know when you're ready to checkout." });
        return state;
      }
    }
    case 'finalized': {
      state.messages.push({ role: 'assistant', content: `Cart ready: ${state.finalizedCartUrl}` });
      return state;
    }
    default:
      return state;
  }
}
