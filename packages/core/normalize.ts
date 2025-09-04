export const COLOR_MAP: Record<string, string[]> = {
  red: ['red', 'crimson', 'burgundy', 'maroon'],
  blue: ['blue', 'navy', 'royal'],
  green: ['green', 'olive', 'forest'],
};

export function normalizeColor(color: string): string | null {
  const lower = color.trim().toLowerCase();
  for (const [canonical, variants] of Object.entries(COLOR_MAP)) {
    if (variants.includes(lower)) return canonical;
  }
  return null;
}

export function colorsMatch(desired: string, candidate: string): boolean {
  const a = normalizeColor(desired);
  const b = normalizeColor(candidate);
  return !!a && a === b;
}

const SIZE_MAP: Record<string, string> = {
  xs: 'xs',
  s: 's',
  m: 'm',
  l: 'l',
  xl: 'xl',
  xxl: 'xxl',
  small: 's',
  medium: 'm',
  large: 'l',
};

export function normalizeSize(size: string): string {
  const lower = size.trim().toLowerCase();
  return SIZE_MAP[lower] || lower;
}
