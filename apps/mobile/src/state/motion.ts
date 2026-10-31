import { useReducedMotion } from 'react-native-reanimated';

import { shouldReduceMotion, usePreferencesStore } from './preferences';

/** Whether to keep movement to a minimum: the player's choice, or the device setting by default. */
export function useReduceMotion(): boolean {
  const systemReduced = useReducedMotion();
  const preference = usePreferencesStore((state) => state.motion);
  return shouldReduceMotion(preference, systemReduced);
}
