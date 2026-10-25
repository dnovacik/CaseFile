import { z } from 'zod';

export const SCHEMA_VERSION = 1;

export const RELATION_TYPES = ['contradicts', 'supports', 'same_event'] as const;
export const EVIDENCE_TYPES = [
  'testimony',
  'document',
  'digital',
  'photograph',
  'physical',
  'timeline',
] as const;

const id = z.string().min(1);
const key = z.string().min(1);

export const requirementsSchema = z.strictObject({
  relationshipIds: z.array(id).optional(),
  deductionIds: z.array(id).optional(),
  factIds: z.array(id).optional(),
  actionIds: z.array(id).optional(),
});

export const factSchema = z.strictObject({
  id,
  evidenceId: id,
  textKey: key,
});

export const evidenceSchema = z.strictObject({
  id,
  type: z.enum(EVIDENCE_TYPES),
  titleKey: key,
  bodyKey: key,
  initial: z.boolean(),
  factIds: z.array(id),
  assetIds: z.array(id).optional(),
});

export const relationshipSchema = z.strictObject({
  id,
  factIds: z.tuple([id, id]),
  type: z.enum(RELATION_TYPES),
  requires: requirementsSchema.optional(),
});

export const deductionSchema = z.strictObject({
  id,
  titleKey: key,
  descriptionKey: key,
  requires: requirementsSchema,
  mandatory: z.boolean(),
});

export const followUpActionSchema = z.strictObject({
  id,
  titleKey: key,
  requires: requirementsSchema,
  revealsEvidenceIds: z.array(id),
});

export const conclusionSchema = z.strictObject({
  id,
  questionKey: key,
  correctChoiceId: id,
  choices: z.array(z.strictObject({ id, labelKey: key })).min(2),
  requiresDeductionIds: z.array(id),
  /** Each set lists evidence and/or deduction IDs; selecting any one complete set proves the answer. */
  acceptedProofSets: z.array(z.array(id).min(1)).min(1),
});

/** Ordered list of relationships the hint system may point at; first eligible entry wins. */
export const hintSchema = z.strictObject({
  relationshipId: id,
  nudgeKey: key,
});

export const caseDefinitionSchema = z.strictObject({
  schemaVersion: z.literal(SCHEMA_VERSION),
  id,
  contentVersion: z.number().int().positive(),
  titleKey: key,
  evidence: z.array(evidenceSchema),
  facts: z.array(factSchema),
  relationships: z.array(relationshipSchema),
  deductions: z.array(deductionSchema),
  actions: z.array(followUpActionSchema),
  conclusions: z.array(conclusionSchema),
  hints: z.array(hintSchema).optional(),
});

export const caseProgressSchema = z.strictObject({
  caseId: id,
  contentVersion: z.number().int().positive(),
  status: z.enum(['new', 'active', 'solved']),
  inspectedEvidenceIds: z.array(id),
  discoveredRelationshipIds: z.array(id),
  unlockedDeductionIds: z.array(id),
  completedActionIds: z.array(id),
  hintsUsed: z.number().int().nonnegative(),
  incorrectSubmissions: z.number().int().nonnegative(),
  elapsedSeconds: z.number().nonnegative(),
});

export type Id = string;
export type RelationType = (typeof RELATION_TYPES)[number];
export type EvidenceType = (typeof EVIDENCE_TYPES)[number];
export type Requirements = z.infer<typeof requirementsSchema>;
export type Fact = z.infer<typeof factSchema>;
export type Evidence = z.infer<typeof evidenceSchema>;
export type Relationship = z.infer<typeof relationshipSchema>;
export type Deduction = z.infer<typeof deductionSchema>;
export type FollowUpAction = z.infer<typeof followUpActionSchema>;
export type Conclusion = z.infer<typeof conclusionSchema>;
export type Hint = z.infer<typeof hintSchema>;
export type CaseDefinition = z.infer<typeof caseDefinitionSchema>;
export type CaseProgress = z.infer<typeof caseProgressSchema>;
