import type { CaseDefinition } from '../schema';

/**
 * A small case shaped like Case 001 that exercises every rule type: initial and hidden evidence,
 * multi-prerequisite deductions, a gated follow-up action and two conclusions with proof sets.
 * Test-only content; it is not the production Case 001.
 */
export function makeCase(): CaseDefinition {
  return {
    schemaVersion: 1,
    id: 'test_case',
    contentVersion: 1,
    titleKey: 'case.title',
    evidence: [
      {
        id: 'E1',
        type: 'testimony',
        titleKey: 'e1.title',
        bodyKey: 'e1.body',
        initial: true,
        factIds: ['F1'],
      },
      {
        id: 'E2',
        type: 'testimony',
        titleKey: 'e2.title',
        bodyKey: 'e2.body',
        initial: true,
        factIds: ['F2a', 'F2b'],
      },
      {
        id: 'E3',
        type: 'digital',
        titleKey: 'e3.title',
        bodyKey: 'e3.body',
        initial: true,
        factIds: ['F3'],
      },
      {
        id: 'E4',
        type: 'digital',
        titleKey: 'e4.title',
        bodyKey: 'e4.body',
        initial: true,
        factIds: ['F4'],
      },
      {
        id: 'E5',
        type: 'physical',
        titleKey: 'e5.title',
        bodyKey: 'e5.body',
        initial: false,
        factIds: ['F5'],
      },
    ],
    facts: [
      { id: 'F1', evidenceId: 'E1', textKey: 'f1' },
      { id: 'F2a', evidenceId: 'E2', textKey: 'f2a' },
      { id: 'F2b', evidenceId: 'E2', textKey: 'f2b' },
      { id: 'F3', evidenceId: 'E3', textKey: 'f3' },
      { id: 'F4', evidenceId: 'E4', textKey: 'f4' },
      { id: 'F5', evidenceId: 'E5', textKey: 'f5' },
    ],
    relationships: [
      { id: 'R1', factIds: ['F2a', 'F3'], type: 'contradicts' },
      { id: 'R2', factIds: ['F2b', 'F4'], type: 'supports' },
      { id: 'R3', factIds: ['F1', 'F5'], type: 'same_event' },
    ],
    deductions: [
      {
        id: 'D1',
        titleKey: 'd1.title',
        descriptionKey: 'd1.desc',
        requires: { relationshipIds: ['R1'] },
        mandatory: true,
      },
      {
        id: 'D2',
        titleKey: 'd2.title',
        descriptionKey: 'd2.desc',
        requires: { relationshipIds: ['R2'] },
        mandatory: true,
      },
      {
        id: 'D3',
        titleKey: 'd3.title',
        descriptionKey: 'd3.desc',
        requires: { relationshipIds: ['R3'], deductionIds: ['D1', 'D2'] },
        mandatory: true,
      },
    ],
    actions: [
      {
        id: 'A1',
        titleKey: 'a1.title',
        requires: { deductionIds: ['D1', 'D2'] },
        revealsEvidenceIds: ['E5'],
      },
    ],
    conclusions: [
      {
        id: 'C1',
        questionKey: 'c1.q',
        correctChoiceId: 'marcus',
        choices: [
          { id: 'marcus', labelKey: 'c1.marcus' },
          { id: 'elena', labelKey: 'c1.elena' },
          { id: 'thomas', labelKey: 'c1.thomas' },
        ],
        requiresDeductionIds: ['D3'],
        acceptedProofSets: [['E3', 'E5']],
      },
      {
        id: 'C2',
        questionKey: 'c2.q',
        correctChoiceId: 'badge',
        choices: [
          { id: 'badge', labelKey: 'c2.badge' },
          { id: 'key', labelKey: 'c2.key' },
        ],
        requiresDeductionIds: ['D1'],
        acceptedProofSets: [['E3'], ['D1']],
      },
    ],
    hints: [
      { relationshipId: 'R1', nudgeKey: 'hint.r1' },
      { relationshipId: 'R2', nudgeKey: 'hint.r2' },
      { relationshipId: 'R3', nudgeKey: 'hint.r3' },
    ],
  };
}

/** Every localized key the definition references (fields ending in "Key"). */
export function makeStrings(def: CaseDefinition): Record<string, string> {
  const strings: Record<string, string> = {};
  const walk = (value: unknown): void => {
    if (Array.isArray(value)) value.forEach(walk);
    else if (value && typeof value === 'object') {
      for (const [field, child] of Object.entries(value)) {
        if (field.endsWith('Key') && typeof child === 'string') strings[child] = child;
        else walk(child);
      }
    }
  };
  walk(def);
  return strings;
}
