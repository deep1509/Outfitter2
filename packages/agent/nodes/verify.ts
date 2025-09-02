import { AgentState } from '../types';
import { colorsMatch, normalizeSize } from '@core/normalize';
import { Intent } from '@core/types';

export function verifyProducts(products: any[], intent: Intent, opts: { allowedHosts: string[] }) {
  const violations: string[] = [];
  const passedProducts: any[] = [];
  for (const product of products) {
    const host = new URL(product.url).host;
    if (!opts.allowedHosts.includes(host)) {
      violations.push('disallowed-host');
      continue;
    }
    const intentItem = intent.items.find((i) => product.title.toLowerCase().includes(i.category));
    if (!intentItem) {
      violations.push('category-mismatch');
      continue;
    }
    const variant = product.variants.find((v: any) => {
      const sizeOk = !intentItem.size || v.options.some((o: any) => normalizeSize(o.value) === normalizeSize(intentItem.size!));
      const colorOk = !intentItem.color || v.options.some((o: any) => colorsMatch(intentItem.color!, o.value));
      const priceOk = !intentItem.budgetCents || v.priceCents <= intentItem.budgetCents;
      return sizeOk && colorOk && priceOk;
    });
    if (!variant) {
      violations.push('variant-mismatch');
      continue;
    }
    passedProducts.push(product);
  }
  return { passed: violations.length === 0, violations, products: passedProducts };
}

export async function verify(state: AgentState): Promise<AgentState> {
  const allowedHosts = (process.env.ALLOWED_SHOPS || '').split(',');
  const res = verifyProducts(state.products || [], state.intent!, { allowedHosts });
  state.guardrailFindings = { violations: res.violations, passed: res.passed };
  state.products = res.products;
  return state;
}
