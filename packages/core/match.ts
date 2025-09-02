import { Product } from './types';
import { colorsMatch, normalizeSize } from './normalize';

export function findVariant(
  product: Product,
  opts: { color?: string; size?: string }
): { variantId: string | null; inStock: boolean } {
  for (const v of product.variants) {
    const sizeOk = !opts.size || v.options.some((o) => normalizeSize(o.value) === normalizeSize(opts.size!));
    const colorOk = !opts.color || v.options.some((o) => colorsMatch(opts.color!, o.value));
    if (sizeOk && colorOk) {
      return { variantId: v.id, inStock: v.available };
    }
  }
  return { variantId: null, inStock: false };
}
