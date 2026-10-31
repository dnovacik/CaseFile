import { create } from 'zustand';

/** "system" follows the device's reduce-motion setting; the others override it. */
export const motionPreferences = ['system', 'reduced', 'full'] as const;
export type MotionPreference = (typeof motionPreferences)[number];

export function isMotionPreference(value: unknown): value is MotionPreference {
  return motionPreferences.includes(value as MotionPreference);
}

export function shouldReduceMotion(preference: MotionPreference, systemReduced: boolean): boolean {
  return preference === 'system' ? systemReduced : preference === 'reduced';
}

/** Settings are stored as text; anything unrecognised falls back to the default. */
export function parseSound(value: string | undefined): boolean {
  return value === 'on';
}

export function serializeSound(enabled: boolean): string {
  return enabled ? 'on' : 'off';
}

type PreferencesState = {
  /** UI sounds. Off until the player turns them on. */
  sound: boolean;
  motion: MotionPreference;
  setSound: (sound: boolean) => void;
  setMotion: (motion: MotionPreference) => void;
};

/** Player preferences. Persistence restores them at launch and saves every change. */
export const usePreferencesStore = create<PreferencesState>((set) => ({
  sound: false,
  motion: 'system',
  setSound: (sound) => set({ sound }),
  setMotion: (motion) => set({ motion }),
}));
