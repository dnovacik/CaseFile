import { locales, type Locale } from '@casefile/content';
import { getLocales } from 'expo-localization';
import { create } from 'zustand';

import { en, type UiStrings } from './en';
import { sk } from './sk';

export { locales, type Locale, type UiStrings };

const strings: Record<Locale, UiStrings> = { en, sk };

/** Each language's name in that language, so the picker reads the same whatever is active. */
export const localeNames: Record<Locale, string> = { en: 'English', sk: 'Slovenčina' };

export function isLocale(value: unknown): value is Locale {
  return locales.includes(value as Locale);
}

/** The first of the device's preferred languages the app supports, otherwise English. */
export function deviceLocale(): Locale {
  try {
    for (const { languageCode } of getLocales()) {
      if (isLocale(languageCode)) return languageCode;
    }
  } catch {
    // Locale detection must never block start-up.
  }
  return 'en';
}

type LocaleState = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

/**
 * The app's language. Starts from the device language; once the player picks one in Settings,
 * persistence saves it and restores it on every launch.
 */
export const useLocaleStore = create<LocaleState>((set) => ({
  locale: deviceLocale(),
  setLocale: (locale) => set({ locale }),
}));

export function useLocale(): Locale {
  return useLocaleStore((state) => state.locale);
}

/** UI strings in the current language. */
export function useUi(): UiStrings {
  return strings[useLocale()];
}
