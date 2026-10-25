import { caseDefinitionSchema, type CaseDefinition, type Id, type Requirements } from './schema';
import { solveCase } from './solver';

export type ValidationIssue = {
  severity: 'error' | 'warning';
  code: string;
  message: string;
};

export type ValidationOptions = {
  /** Localized strings for the case; when given, every referenced key must exist. */
  strings?: Record<string, string>;
  /** Asset IDs bundled with the case; when given, every referenced asset must exist. */
  assetIds?: Iterable<Id>;
};

export type CheckResult =
  | { ok: true; definition: CaseDefinition; issues: ValidationIssue[] }
  | { ok: false; definition?: CaseDefinition; issues: ValidationIssue[] };

/** Parse unknown JSON into a case definition and run every validation check on it. */
export function checkCase(json: unknown, options: ValidationOptions = {}): CheckResult {
  const parsed = caseDefinitionSchema.safeParse(json);
  if (!parsed.success) {
    return {
      ok: false,
      issues: parsed.error.issues.map((issue) => ({
        severity: 'error',
        code: 'schema',
        message: `${issue.path.join('.') || '(root)'}: ${issue.message}`,
      })),
    };
  }
  const issues = validateCase(parsed.data, options);
  if (issues.some((issue) => issue.severity === 'error')) {
    return { ok: false, definition: parsed.data, issues };
  }
  return { ok: true, definition: parsed.data, issues };
}

/**
 * Semantic checks on a schema-valid definition: unique IDs, references, dependency cycles,
 * localized strings, assets and, when the structure is sound, full-path solvability.
 */
export function validateCase(
  def: CaseDefinition,
  options: ValidationOptions = {},
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const error = (code: string, message: string) =>
    issues.push({ severity: 'error', code, message });
  const warn = (code: string, message: string) =>
    issues.push({ severity: 'warning', code, message });

  // IDs are unique across the whole case, so proof sets and requirements are unambiguous.
  const seen = new Set<Id>();
  const allIds = [
    ...def.evidence,
    ...def.facts,
    ...def.relationships,
    ...def.deductions,
    ...def.actions,
    ...def.conclusions,
  ].map((item) => item.id);
  for (const id of allIds) {
    if (seen.has(id)) error('duplicate_id', `ID "${id}" is used more than once`);
    seen.add(id);
  }

  const evidence = new Map(def.evidence.map((e) => [e.id, e]));
  const facts = new Map(def.facts.map((f) => [f.id, f]));
  const relationships = new Set(def.relationships.map((r) => r.id));
  const deductions = new Set(def.deductions.map((d) => d.id));
  const actions = new Set(def.actions.map((a) => a.id));

  for (const fact of def.facts) {
    const owner = evidence.get(fact.evidenceId);
    if (!owner)
      error('missing_ref', `Fact ${fact.id} references missing evidence ${fact.evidenceId}`);
    else if (!owner.factIds.includes(fact.id)) {
      error('fact_not_listed', `Fact ${fact.id} is not listed in evidence ${owner.id}.factIds`);
    }
  }
  for (const item of def.evidence) {
    for (const factId of item.factIds) {
      const fact = facts.get(factId);
      if (!fact) error('missing_ref', `Evidence ${item.id} lists missing fact ${factId}`);
      else if (fact.evidenceId !== item.id) {
        error(
          'fact_owner_mismatch',
          `Evidence ${item.id} lists fact ${factId} owned by ${fact.evidenceId}`,
        );
      }
    }
  }

  const pairs = new Map<string, Id>();
  for (const rel of def.relationships) {
    const [a, b] = rel.factIds;
    if (a === b) error('self_relationship', `Relationship ${rel.id} links fact ${a} to itself`);
    for (const factId of rel.factIds) {
      if (!facts.has(factId))
        error('missing_ref', `Relationship ${rel.id} references missing fact ${factId}`);
    }
    const pair = a < b ? `${a}|${b}` : `${b}|${a}`;
    const other = pairs.get(pair);
    if (other)
      error('duplicate_pair', `Relationships ${other} and ${rel.id} use the same fact pair`);
    pairs.set(pair, rel.id);
  }

  const checkRequirements = (owner: string, requires: Requirements | undefined) => {
    const refs: [keyof Requirements, Set<Id> | Map<Id, unknown>][] = [
      ['relationshipIds', relationships],
      ['deductionIds', deductions],
      ['actionIds', actions],
      ['factIds', facts],
    ];
    for (const [field, known] of refs) {
      for (const id of requires?.[field] ?? []) {
        if (!known.has(id))
          error('missing_ref', `${owner} requires missing ${field.slice(0, -3)} ${id}`);
      }
    }
  };
  for (const rel of def.relationships) checkRequirements(`Relationship ${rel.id}`, rel.requires);
  for (const ded of def.deductions) checkRequirements(`Deduction ${ded.id}`, ded.requires);
  for (const act of def.actions) {
    checkRequirements(`Action ${act.id}`, act.requires);
    for (const id of act.revealsEvidenceIds) {
      const target = evidence.get(id);
      if (!target) error('missing_ref', `Action ${act.id} reveals missing evidence ${id}`);
      else if (target.initial)
        warn('reveals_initial', `Action ${act.id} reveals initial evidence ${id}`);
    }
  }

  const revealed = new Set(def.actions.flatMap((a) => a.revealsEvidenceIds));
  for (const item of def.evidence) {
    if (!item.initial && !revealed.has(item.id)) {
      error('unreachable_evidence', `Evidence ${item.id} is not initial and no action reveals it`);
    }
  }

  if (def.conclusions.length === 0) {
    error('no_conclusions', 'Case has no conclusions, so the final report proves nothing');
  }
  for (const con of def.conclusions) {
    const choiceIds = con.choices.map((c) => c.id);
    if (new Set(choiceIds).size !== choiceIds.length) {
      error('duplicate_choice', `Conclusion ${con.id} has duplicate choice IDs`);
    }
    if (!choiceIds.includes(con.correctChoiceId)) {
      error(
        'missing_ref',
        `Conclusion ${con.id} correct choice ${con.correctChoiceId} is not a choice`,
      );
    }
    for (const id of con.requiresDeductionIds) {
      if (!deductions.has(id))
        error('missing_ref', `Conclusion ${con.id} requires missing deduction ${id}`);
    }
    for (const id of con.acceptedProofSets.flat()) {
      if (!evidence.has(id) && !deductions.has(id)) {
        error('invalid_proof', `Conclusion ${con.id} proof ${id} is not evidence or a deduction`);
      }
    }
  }

  for (const hint of def.hints ?? []) {
    if (!relationships.has(hint.relationshipId)) {
      error('missing_ref', `Hint references missing relationship ${hint.relationshipId}`);
    }
  }

  for (const cycle of findCycles(def)) {
    error('dependency_cycle', `Dependency cycle: ${cycle.join(' → ')}`);
  }

  if (options.strings) {
    const strings = options.strings;
    for (const k of collectKeys(def)) {
      if (!(k in strings)) error('missing_string', `Missing localized string "${k}"`);
    }
  }
  if (options.assetIds) {
    const assets = new Set(options.assetIds);
    for (const item of def.evidence) {
      for (const assetId of item.assetIds ?? []) {
        if (!assets.has(assetId))
          error('missing_asset', `Evidence ${item.id} references missing asset ${assetId}`);
      }
    }
  }

  // Simulation only makes sense on a structurally sound case.
  if (!issues.some((issue) => issue.severity === 'error')) {
    const solution = solveCase(def);
    for (const id of solution.unreachableEvidenceIds) {
      error('unreachable_evidence', `Evidence ${id} can never be revealed`);
    }
    for (const id of solution.unreachableRelationshipIds) {
      error('unreachable_relationship', `Relationship ${id} can never be established`);
    }
    for (const id of solution.unreachableDeductionIds) {
      const mandatory = def.deductions.find((d) => d.id === id)?.mandatory;
      const message = `Deduction ${id} can never be unlocked`;
      if (mandatory) error('unreachable_deduction', message);
      else warn('unreachable_deduction', message);
    }
    for (const id of solution.unprovableConclusionIds) {
      error('unprovable_conclusion', `Conclusion ${id} has no proof set the player can assemble`);
    }
    if (!solution.solved)
      error('unsolvable', 'Full-path simulation could not submit a correct report');
  }

  return issues;
}

function collectKeys(def: CaseDefinition): string[] {
  return [
    def.titleKey,
    ...def.evidence.flatMap((e) => [e.titleKey, e.bodyKey]),
    ...def.facts.map((f) => f.textKey),
    ...def.deductions.flatMap((d) => [d.titleKey, d.descriptionKey]),
    ...def.actions.map((a) => a.titleKey),
    ...def.conclusions.flatMap((c) => [
      c.questionKey,
      ...c.choices.map((choice) => choice.labelKey),
    ]),
    ...(def.hints ?? []).map((h) => h.nudgeKey),
  ];
}

/**
 * Dependency graph over relationships, deductions, actions and evidence. Requirements are edges;
 * a relationship also depends on the evidence holding its facts, a fact requirement on that
 * evidence, and non-initial evidence on the actions that reveal it.
 */
function findCycles(def: CaseDefinition): Id[][] {
  const factOwner = new Map(def.facts.map((f) => [f.id, f.evidenceId]));
  const revealers = new Map<Id, Id[]>();
  for (const action of def.actions) {
    for (const id of action.revealsEvidenceIds)
      revealers.set(id, [...(revealers.get(id) ?? []), action.id]);
  }
  const edges = new Map<Id, Id[]>();
  const requirementEdges = (requires: Requirements | undefined): Id[] => [
    ...(requires?.relationshipIds ?? []),
    ...(requires?.deductionIds ?? []),
    ...(requires?.actionIds ?? []),
    ...(requires?.factIds ?? []).flatMap((id) => factOwner.get(id) ?? []),
  ];
  for (const rel of def.relationships) {
    edges.set(rel.id, [
      ...requirementEdges(rel.requires),
      ...rel.factIds.flatMap((id) => factOwner.get(id) ?? []),
    ]);
  }
  for (const ded of def.deductions) edges.set(ded.id, requirementEdges(ded.requires));
  for (const act of def.actions) edges.set(act.id, requirementEdges(act.requires));
  // An evidence item is reachable through any one revealing action, so only treat it as
  // dependent when exactly one action reveals it; multiple revealers are alternatives.
  for (const item of def.evidence) {
    const by = revealers.get(item.id) ?? [];
    edges.set(item.id, item.initial || by.length !== 1 ? [] : by);
  }

  const cycles: Id[][] = [];
  const state = new Map<Id, 'visiting' | 'done'>();
  const stack: Id[] = [];
  const visit = (node: Id) => {
    state.set(node, 'visiting');
    stack.push(node);
    for (const next of edges.get(node) ?? []) {
      if (state.get(next) === 'visiting') {
        cycles.push([...stack.slice(stack.indexOf(next)), next]);
      } else if (!state.has(next)) {
        visit(next);
      }
    }
    stack.pop();
    state.set(node, 'done');
  };
  for (const node of edges.keys()) if (!state.has(node)) visit(node);
  return cycles;
}
