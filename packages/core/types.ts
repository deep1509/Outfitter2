export type VariantOption = { name: string; value: string };

export type Variant = {
  id: string;
  title?: string;
  priceCents: number;
  available: boolean;
  options: VariantOption[];
};

export type Product = {
  id: string;
  title: string;
  handle: string;
  url: string;
  tags?: string[];
  images?: string[];
  variants: Variant[];
  priceCents: number;
};

export type Suggestion = {
  product: Product;
  variantId: string;
  cartUrl: string;
};

export type IntentItem = {
  category: 'shirt' | 'pants';
  color?: string;
  size?: string;
  budgetCents?: number;
};

export type Intent = {
  items: IntentItem[];
  budgetCents?: number;
};
