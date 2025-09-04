import { describe, it, expect } from 'vitest';
import { parseSelection } from '../packages/agent/nodes/parseSelection.js';

describe('parseSelection', () => {
  it('parses mixed formats', () => {
    expect(parseSelection('I like option 1 and 2')).toEqual([1, 2]);
    expect(parseSelection('1,2')).toEqual([1, 2]);
    expect(parseSelection('option two')).toEqual([2]);
  });
});
