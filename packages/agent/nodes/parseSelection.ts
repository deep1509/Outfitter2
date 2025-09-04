export const WORD_TO_NUM: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
};

export function parseSelection(text: string, max?: number): number[] {
  const nums = new Set<number>();
  const digitMatches = text.match(/\d+/g);
  if (digitMatches) {
    for (const m of digitMatches) {
      nums.add(parseInt(m, 10));
    }
  }
  const wordRegex = new RegExp(Object.keys(WORD_TO_NUM).join('|'), 'gi');
  const wordMatches = text.match(wordRegex);
  if (wordMatches) {
    for (const w of wordMatches) {
      nums.add(WORD_TO_NUM[w.toLowerCase()]);
    }
  }
  let arr = Array.from(nums);
  if (max) {
    arr = arr.filter((n) => n >= 1 && n <= max);
  }
  arr.sort((a, b) => a - b);
  return arr;
}
