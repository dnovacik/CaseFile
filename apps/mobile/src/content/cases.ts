import { cases, getCase, type CaseContent } from '@casefile/content';
import { caseArt } from '@casefile/content/art';
import type { ImageSource } from 'expo-image';

export { cases, getCase, type CaseContent };

/** Image for an asset ID from case content, if it is bundled. */
export function artFor(assetId: string | undefined): ImageSource | undefined {
  if (assetId === undefined) return undefined;
  return (caseArt as Record<string, ImageSource>)[assetId];
}

/** Translator for one case's strings. Missing keys fall back to the key so gaps are visible. */
export function caseText(content: CaseContent) {
  return (key: string): string => content.strings[key] ?? key;
}

/**
 * Cases from the planned collection (docs/GDD.md) that aren't authored yet. They appear in the
 * library as "coming soon" with their card art.
 */
export const upcomingCases = [
  { number: 3, title: 'The Empty Room', assetId: 'case-03-card' },
  { number: 4, title: '21:37', assetId: 'case-04-card' },
  { number: 5, title: 'The Forged Signature', assetId: 'case-05-card' },
  { number: 6, title: 'Silent Alarm', assetId: 'case-06-card' },
  { number: 7, title: 'The Wrong Photograph', assetId: 'case-07-card' },
  { number: 8, title: 'Dead Air', assetId: 'case-08-card' },
  { number: 9, title: 'The Final Passenger', assetId: 'case-09-card' },
  { number: 10, title: 'Paper Trail', assetId: 'case-10-card' },
] as const;

export const totalCases = cases.length + upcomingCases.length;
