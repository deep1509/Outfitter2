export const COLOR_MAP: Record<string, string[]> = {
  red: ['red', 'crimson', 'burgundy', 'maroon'],
  blue: ['blue', 'navy', 'royal'],
  green: ['green', 'olive', 'forest']
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

export function normalizeSize(size: string): string {
  return size.trim().toLowerCase();
}
