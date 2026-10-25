import { describe, expect, it } from 'vitest';

import { factPairKey, RELATION_TYPES, SCHEMA_VERSION } from './index';

describe('engine scaffold', () => {
  it('exposes schema version 1', () => {
    expect(SCHEMA_VERSION).toBe(1);
  });

  it('defines the three guided-deduction relation types', () => {
    expect(RELATION_TYPES).toEqual(['contradicts', 'supports', 'same_event']);
  });

  it('builds order-insensitive fact pair keys', () => {
    expect(factPairKey('F05', 'F02')).toBe(factPairKey('F02', 'F05'));
  });
});
