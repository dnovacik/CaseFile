import { caseDefinitionSchema, type CaseDefinition } from '@casefile/engine';

import case001 from './cases/case-001/case.json';
import case001En from './cases/case-001/en.json';
import case001Sk from './cases/case-001/sk.json';
import case002 from './cases/case-002/case.json';
import case002En from './cases/case-002/en.json';
import case002Sk from './cases/case-002/sk.json';

/** Languages every bundled case is written in. English is the source and the fallback. */
export const locales = ['en', 'sk'] as const;
export type Locale = (typeof locales)[number];

export type CaseContent = {
  definition: CaseDefinition;
  /** Localized strings per language, keyed by the definition's `*Key` fields. */
  strings: Record<Locale, Record<string, string>>;
};

/** All bundled cases in library order. Definitions are parsed so JSON typos fail loudly. */
export const cases: CaseContent[] = [
  { definition: caseDefinitionSchema.parse(case001), strings: { en: case001En, sk: case001Sk } },
  { definition: caseDefinitionSchema.parse(case002), strings: { en: case002En, sk: case002Sk } },
];

export function getCase(id: string): CaseContent | undefined {
  return cases.find((c) => c.definition.id === id);
}
