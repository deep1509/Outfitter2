import { AgentState } from '../types';
import { colorsMatch, normalizeSize } from '@core/normalize';
import { Intent, Product, Variant } from '@core/types';
import { z } from 'zod';

const VariantSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  priceCents: z.number(),
  available: z.boolean(),
  options: z.array(z.object({ name: z.string(), value: z.string() })),
});

const ProductSchema = z.object({
  id: z.string(),
  title: z.string(),
  handle: z.string(),
  url: z.string().url(),
  tags: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  variants: z.array(VariantSchema),
  priceCents: z.number(),
});

export function verifyProducts(
  products: Product[],
  intent: Intent,
  opts: { allowedHosts: string[] }
) {
  const violations: string[] = [];

  const parsed = ProductSchema.array().safeParse(products);
  if (!parsed.success) {
    violations.push('invalid-product');
    return { passed: false, violations, products: [] as Product[] };
  }

  const passedProducts: Product[] = [];

  for (const product of parsed.data) {
    const host = new URL(product.url).host;
    if (!opts.allowedHosts.includes(host)) {
      violations.push('disallowed-host');
      continue;
    }

    const intentItem = intent.items.find((i) =>
      product.title.toLowerCase().includes(i.category)
    );
    if (!intentItem) {
      violations.push('category-mismatch');
      continue;
    }

    const variant = product.variants.find((v: Variant) => {
      const sizeOk =
        !intentItem.size ||
        v.options.some((o) => normalizeSize(o.value) === normalizeSize(intentItem.size!));
      const colorOk =
        !intentItem.color ||
        v.options.some((o) => colorsMatch(intentItem.color!, o.value));
      const priceOk =
        !intentItem.budgetCents || v.priceCents <= intentItem.budgetCents;
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
  state.debug?.push(`verify: ${JSON.stringify(state.guardrailFindings)}`);
  return state;
}
