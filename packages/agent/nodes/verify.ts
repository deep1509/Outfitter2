import { AgentState } from '../types.js';
import { colorsMatch, normalizeSize } from '../../core/normalize.js';
import { Intent, Product, Variant } from '../../core/types.js';
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
    return { passed: false, violations, products: [] as Product[], confidence: 0 };
  }

  const passedProducts: Product[] = [];

  for (const product of parsed.data) {
    const host = new URL(product.url).host.replace(/^www\./, '');
    if (!opts.allowedHosts.includes(host)) {
      violations.push('disallowed-host');
      continue;
    }

    const intentItem = intent.items.find((i) => {
      const titleMatch = product.title.toLowerCase().includes(i.category);
      const tagMatch = product.tags?.some(t => t.toLowerCase().includes(i.category));
      return titleMatch || tagMatch;
    });
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
      return sizeOk && colorOk && priceOk && v.available;
    });

    if (!variant) {
      violations.push('variant-mismatch');
      continue;
    }

    passedProducts.push(product);
  }

  const confidence = parsed.data.length
    ? passedProducts.length / parsed.data.length
    : 0;

  return { passed: violations.length === 0, violations, products: passedProducts, confidence };
}

export async function verify(state: AgentState): Promise<AgentState> {
  const allowedHosts = (process.env.ALLOWED_SHOPS || 'culturekings.com.au')
    .split(',')
    .map((h) => h.trim().replace(/^www\./, ''));
  const res = verifyProducts(state.candidates || [], {
    items: state.intent
      ? state.intent.categories.map((c) => ({
          category: c as any,
          color: state.intent?.color,
          size: state.intent?.size,
          budgetCents: state.intent?.budgetCents,
        }))
      : [],
  } as Intent, { allowedHosts });
  state.guardrailFindings = {
    violations: res.violations,
    passed: res.passed,
    confidence: res.confidence,
  };
  state.verified = res.products;
  return state;
}
