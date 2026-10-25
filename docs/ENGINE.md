# Deduction engine and JSON authoring specification

## Implementation boundary
A framework-independent TypeScript package implements case loading, validation, state transition and resolution. Expo UI only displays data and dispatches commands; it never decides whether a relationship is correct. JSON controls all case-specific logic.

## Data structures (proposed)
```ts
type Id = string;
type RelationType = 'contradicts' | 'supports' | 'same_event';
type Requirements = {
  relationshipIds?: Id[];
  deductionIds?: Id[];
  factIds?: Id[];
  actionIds?: Id[];
};
type Fact = { id: Id; evidenceId: Id; textKey: string };
type Evidence = {
  id: Id;
  type: 'testimony' | 'document' | 'digital' | 'photograph' | 'physical' | 'timeline';
  titleKey: string;
  bodyKey: string;
  initial: boolean;
  factIds: Id[];
  assetIds?: Id[];
};
type Relationship = {
  id: Id; factIds: [Id, Id]; type: RelationType; requires?: Requirements;
};
type Deduction = {
  id: Id; titleKey: string; descriptionKey: string;
  requires: Requirements; mandatory: boolean;
};
type FollowUpAction = {
  id: Id; titleKey: string; requires: Requirements; revealsEvidenceIds: Id[];
};
type Conclusion = {
  id: Id; questionKey: string; correctChoiceId: Id;
  choices: { id: Id; labelKey: string }[];
  requiresDeductionIds: Id[];
  acceptedProofSets: Id[][];
};
type CaseDefinition = {
  schemaVersion: 1; id: Id; contentVersion: number; titleKey: string;
  evidence: Evidence[]; facts: Fact[]; relationships: Relationship[];
  deductions: Deduction[]; actions: FollowUpAction[];
  conclusions: Conclusion[];
};
type CaseProgress = {
  caseId: Id; contentVersion: number;
  status: 'new' | 'active' | 'solved';
  inspectedEvidenceIds: Id[];
  discoveredRelationshipIds: Id[];
  unlockedDeductionIds: Id[];
  completedActionIds: Id[];
  hintsUsed: number; incorrectSubmissions: number; elapsedSeconds: number;
};
```

## Commands
- `inspectEvidence(id)`: succeeds only if evidence is currently available; marks inspected.
- `linkFacts(a, b, relationType)`: order-insensitive fact pair; both facts must be inspected and visible; validates the authored relationship type without hinting the correct one.
- `performAction(id)`: checks deductions/relationships and reveals authored evidence IDs.
- `requestHint(stage)`: only returns authored hint content; final stage may discover a valid link. (Named `requestHint` rather than `useHint` so it isn't mistaken for a React hook.)
- `submitReport(answers, selectedProofIds)`: validates prerequisites, answers and at least one authored accepted proof set.
- `resetCase()`: deliberately clears a case's state.

Return structured result codes (`valid`, `not_established`, `not_available`, `already_discovered`, `requires_more_investigation`, `invalid_input`); keep hidden solution metadata out of player-facing result payloads.

## Implemented rules (`packages/engine`)
- **Schema:** Zod schemas in `schema.ts` are the single source of truth; TypeScript types are inferred from them. Unknown fields are rejected.
- **IDs** are unique across the whole case (evidence, facts, relationships, deductions, actions, conclusions), so proof sets can mix evidence and deduction IDs unambiguously.
- **Links:** a wrong type, an unrelated pair and a pair whose `requires` are unmet all return `not_established`, so feedback never reveals which part was wrong. Linking a fact to itself is `invalid_input`.
- **Hints:** `hints` is an optional ordered list of `{ relationshipId, nudgeKey }`. The target is the first hinted relationship that is undiscovered, has its prerequisites met and whose facts are on available evidence. Stage 1 returns the nudge, stage 2 the two fact IDs, stage 3 establishes the relationship (inspecting its evidence if needed). Every hint call increments `hintsUsed`.
- **Final report:** answers are one choice per conclusion plus a shared proof selection. It is accepted when all answers are correct, each conclusion has an accepted proof set fully contained in the selection, and every selected ID belongs to some accepted proof set, so selecting everything cannot pass. Missing mandatory deductions return `requires_more_investigation` without counting as a wrong submission; a wrong report increments `incorrectSubmissions` and keeps all progress.
- **Saves:** `loadProgress` rejects malformed saves, saves for another case, saves for another `contentVersion` (`content_version_mismatch`: migrate, never reset) and unknown IDs, then re-derives deductions.
- **Validation:** `checkCase(json, { strings, assetIds })` runs schema parsing, reference/ownership checks, duplicate fact pairs, dependency cycles (including through action-revealed evidence), unreachable hidden evidence, proof references, optional localized-string and asset checks, then the full-path solver (`solveCase`). Unreachable mandatory deductions and unprovable conclusions are errors; unreachable optional deductions are warnings.

## Evaluation
A valid relationship unlocks its ID. Re-evaluate deduction rules in dependency/topological order until fixed point, requiring all facts/relationships/deductions/actions in a rule. Recompute follow-up availability. A completed action reveals evidence but does not automatically mark it inspected. Deterministic progression; state updates atomically persisted.

## JSON snippet — illustration, not production content
```json
{
  "schemaVersion": 1,
  "id": "case_001",
  "contentVersion": 1,
  "titleKey": "case_001.title",
  "evidence": [
    {"id":"E02","type":"testimony","titleKey":"e02.title","bodyKey":"e02.body","initial":true,"factIds":["F02"]},
    {"id":"E05","type":"digital","titleKey":"e05.title","bodyKey":"e05.body","initial":true,"factIds":["F05"]}
  ],
  "facts": [
    {"id":"F02","evidenceId":"E02","textKey":"f02"},
    {"id":"F05","evidenceId":"E05","textKey":"f05"}
  ],
  "relationships": [{"id":"R01","factIds":["F02","F05"],"type":"contradicts"}],
  "deductions": [{"id":"D01","titleKey":"d01.title","descriptionKey":"d01.description","requires":{"relationshipIds":["R01"]},"mandatory":true}],
  "actions": [],
  "conclusions": []
}
```

## Validation / fairness
Validate ID uniqueness, references, locales/assets, enums, no cycles, no hidden-fact comparisons, action availability, mandatory conclusion reachability and correct proof references. Build a deterministic full-path solver for structural reachability, separate from **human narrative review**. The sample Case 001 currently has a badge identity inference to phrase carefully; see [CASE-001.md](CASE-001.md).

## Test matrix
Fact pair order independence; wrong type rejection; hidden evidence blocked; no duplicate discoveries; multi-prerequisite unlock; investigation-action gating; required evidence proof set; incorrect final report retry; save/load roundtrip; broken links/cycles/unreachable case rejection; no false identification from badge owner. Unit test pure engine with Vitest (or equivalent) and test case fixtures.

## Save strategy
Version format (`schemaVersion`) independently from authored content (`contentVersion`); stable IDs and explicit migrations. Save elapsed time, hints and attempts; derive visible state rather than persisting UI presentation. SQLite is durable, Zustand is transient. Never silently reset purchased case progress.

## Suggested repository organization
```text
apps/mobile/          # Expo UI and router
packages/engine/      # Pure TS and unit tests
content/cases/        # Authored JSON + locales
content/assets/       # Photo / audio / media
docs/                 # Product and development references
```
