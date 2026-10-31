import { cases, getCase, type CaseContent } from '@casefile/content';
import { caseArt } from '@casefile/content/art';
import type { ImageSource } from 'expo-image';

import { useLocale } from '@/i18n';

export { cases, getCase, type CaseContent };

/** Image for an asset ID from case content, if it is bundled. */
export function artFor(assetId: string | undefined): ImageSource | undefined {
  if (assetId === undefined) return undefined;
  return (caseArt as Record<string, ImageSource>)[assetId];
}

/**
 * Translator for one case's strings in the current language. A key missing from a translation
 * falls back to English, then to the key itself so gaps are visible.
 */
export function useCaseText(content: CaseContent) {
  const strings = content.strings[useLocale()];
  return (key: string): string => strings[key] ?? content.strings.en[key] ?? key;
}

/**
 * Cases from the planned collection (docs/GDD.md) that aren't authored yet. They appear in the
 * library as "coming soon" with their card art; titles live in the UI strings.
 */
export const upcomingCases = [
  { number: 4, assetId: 'case-04-card' },
  { number: 5, assetId: 'case-05-card' },
  { number: 6, assetId: 'case-06-card' },
  { number: 7, assetId: 'case-07-card' },
  { number: 8, assetId: 'case-08-card' },
  { number: 9, assetId: 'case-09-card' },
  { number: 10, assetId: 'case-10-card' },
] as const;

export const totalCases = cases.length + upcomingCases.length;
