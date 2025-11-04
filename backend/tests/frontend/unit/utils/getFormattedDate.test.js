import {describe, it, expect} from 'vitest';
import getFormattedDate from '../../../../../frontend/script/utils/getFormattedDate.js';

describe('getFormattedDate', () => {
  it('should return DD-MM-YYYY', () => {
    expect(getFormattedDate('2025-09-15')).toBe('15-09-2025')
    expect(getFormattedDate('2025-12-31')).toBe('31-12-2025')
  });
})