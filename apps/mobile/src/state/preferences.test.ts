import { describe, expect, it } from 'vitest';

import { isMotionPreference, parseSound, serializeSound, shouldReduceMotion } from './preferences';

describe('shouldReduceMotion', () => {
  it('follows the device when set to system', () => {
    expect(shouldReduceMotion('system', true)).toBe(true);
    expect(shouldReduceMotion('system', false)).toBe(false);
  });

  it('lets the player override the device either way', () => {
    expect(shouldReduceMotion('reduced', false)).toBe(true);
    expect(shouldReduceMotion('full', true)).toBe(false);
  });
});

describe('stored preference values', () => {
  it('accepts only known motion preferences', () => {
    expect(isMotionPreference('reduced')).toBe(true);
    expect(isMotionPreference('fast')).toBe(false);
    expect(isMotionPreference(undefined)).toBe(false);
  });

  it('round-trips sound and keeps it off for anything unrecognised', () => {
    expect(parseSound(serializeSound(true))).toBe(true);
    expect(parseSound(serializeSound(false))).toBe(false);
    expect(parseSound(undefined)).toBe(false);
    expect(parseSound('yes')).toBe(false);
  });
});
