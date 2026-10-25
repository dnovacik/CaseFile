import { caseDefinitionSchema, type CaseDefinition } from '@casefile/engine';

import case001 from './cases/case-001/case.json';
import case001En from './cases/case-001/en.json';

export type CaseContent = {
  definition: CaseDefinition;
  /** Localized strings keyed by the definition's `*Key` fields. */
  strings: Record<string, string>;
};

/** All bundled cases in library order. Definitions are parsed so JSON typos fail loudly. */
export const cases: CaseContent[] = [
  { definition: caseDefinitionSchema.parse(case001), strings: case001En },
];

export function getCase(id: string): CaseContent | undefined {
  return cases.find((c) => c.definition.id === id);
}
