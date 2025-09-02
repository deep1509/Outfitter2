import { Product } from './types';
import { httpGet } from './http';

export function buildCartPermalink(domain: string, variantIds: string[]): string {
  return `https://${domain}/cart/${variantIds.map((v) => `${v}:1`).join(',')}`;
}

export async function fetchShopifyProduct(url: string): Promise<Product> {
  const u = new URL(url);
  const handle = u.pathname.split('/').filter(Boolean).pop()!;
  const jsonUrl = `${u.origin}/products/${handle}.js`;
  const res = await httpGet(jsonUrl);
  const data: any = await res.json();
  return {
    id: String(data.id),
    title: data.title,
    handle: data.handle,
    url,
    tags: data.tags?.split(',').map((t: string) => t.trim()) || [],
    images: data.images || [],
    priceCents: Math.round(Number(data.price) || 0),
    variants: (data.variants || []).map((v: any) => ({
      id: String(v.id),
      title: v.title,
      priceCents: Math.round(Number(v.price) || 0),
      available: v.available,
      options: [
        v.option1 && { name: 'Color', value: v.option1 },
        v.option2 && { name: 'Size', value: v.option2 }
      ].filter(Boolean) as any
    }))
  };
}
