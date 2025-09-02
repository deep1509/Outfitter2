import { Intent } from './types';

export function extractIntent(text: string): Intent {
  const items: Intent['items'] = [];
  const colorMatch = text.match(/\b(red|blue|green)\b/i);
  const sizeMatch = text.match(/\b(XXL|XL|L|M|S|XS)\b/i);
  const budgetMatch = text.match(/\$(\d+)/);
  const budgetCents = budgetMatch ? parseInt(budgetMatch[1], 10) * 100 : undefined;

  if (/shirt/i.test(text)) {
    items.push({ category: 'shirt', color: colorMatch?.[1].toLowerCase(), size: sizeMatch?.[1]?.toUpperCase(), budgetCents });
  }
  if (/pant|trouser|cargo/i.test(text)) {
    items.push({ category: 'pants', color: colorMatch?.[1].toLowerCase(), size: sizeMatch?.[1]?.toUpperCase(), budgetCents });
  }

  return { items, budgetCents };
}
