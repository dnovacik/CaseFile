import { caseDefinitionSchema, type CaseDefinition } from '@casefile/engine';

import case001 from './cases/case-001/case.json';
import case001En from './cases/case-001/en.json';
import case002 from './cases/case-002/case.json';
import case002En from './cases/case-002/en.json';

export type CaseContent = {
  definition: CaseDefinition;
  /** Localized strings keyed by the definition's `*Key` fields. */
  strings: Record<string, string>;
};

/** All bundled cases in library order. Definitions are parsed so JSON typos fail loudly. */
export const cases: CaseContent[] = [
  { definition: caseDefinitionSchema.parse(case001), strings: case001En },
  { definition: caseDefinitionSchema.parse(case002), strings: case002En },
];

export function getCase(id: string): CaseContent | undefined {
  return cases.find((c) => c.definition.id === id);
}
