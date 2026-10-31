# Casefile implementation roadmap

**Baseline:** initial planning PR. Product docs are design proposals, not a claim the app is implemented.

## Roadmap and acceptance gates

### M0 — Scaffold (0.5–1 week)
Expo + TypeScript + Expo Router workspace; `apps/mobile`, `packages/engine`, `content/cases`; ESLint, formatting, tests, CI, asset bundling, Android/iOS smoke run. **Done:** app launches, engine package imports cleanly, CI passes.

### M1 — Engine and authoring validation (1–2 weeks)
Define versioned JSON / Zod or JSON Schema, fact IDs, link rules, prerequisites, investigative actions, final-report proof sets, locale/media assets. Implement immutable deterministic engine, validation and comprehensive unit tests. **Done:** reachability solver confirms mandatory deductions, no cycles or missing assets, completion test works offline.

### M2 — Case 001 vertical slice (2–3 weeks)
Case Library, Briefing, Evidence Detail, fact comparison, Deduction Board, investigation action, Final Report, Resolution. Implement neo-noir tokens and simple transitions. **Done:** Case 001 playable from fresh state to supported resolution on Android and iOS.

### M3 — Persistence, hints, polish and usability (2–3 weeks)
SQLite saves with version migrations, Zustand UI state, tiered hints, accessibility, optional sounds, graceful interruption/restart, offline testing, 5–10 blind playtests. **Done:** case is fair and understandable, usable in portrait, completion reliably saved.

### M4 — Build case collection (3–5 weeks)
Expand to 5–10 fully authored, graph-validated and human-playtested cases, difficulty progression, optional recurring meta-clues and asset workflow. **Done:** no mandatory mystery relies on luck or unavailable information.

Cases 001–003 ship bundled with the app. From Case 004 on, cases are **live case packs** (`content/packs/`, design in `docs/superpowers/specs/2026-10-31-live-cases-design.md`) published with `scripts/publish-content.sh`, so the collection grows without store releases. Case 004 is the first live pack.

### M5 — Monetization / release (1–2 weeks)
2–3 free cases; one-time full collection unlock with purchase restore; internal store testing, accessibility/performance QA and store assets. **Done:** offline owned cases work, entitlement recovery and release checks verified.

**Planning estimate:** approximately 10–17 focused solo-development weeks; content authoring and blind playtests are main uncertainty.

## Next PRs (recommended)
1. `chore: scaffold Expo workspace and CI`
2. `feat(engine): implement case schema and deterministic deduction reducer`
3. `content: author validated case 001 JSON and translations`
4. `feat(mobile): library and briefing`
5. `feat(mobile): evidence inspection and guided comparison`
6. `feat(mobile): deduction board and follow-up actions`
7. `feat(mobile): final report and resolution`
8. `feat(storage): SQLite autosave and migration`
9. `feat(mobile): hints, accessible UX and polish`
10. `content: complete initial case collection`
11. `feat(billing): premium unlock and restore`

## Case 001 acceptance checklist
- [ ] All nine evidence items render; E09 hidden until A01.
- [ ] Fact pairs are selected and matching relationships validated without spoilers.
- [ ] R01/R02/D01/D02 prerequisites work; A01 unlocks only when justified.
- [ ] E09 is revealed, not auto-inspected; D03 can then be established.
- [ ] Final report requires valid answers and accepted proof set.
- [ ] Wrong submissions allow retry and preserve progress.
- [ ] App fully works offline and resumes after force-close.
- [ ] Validator rejects invalid references, dependency cycles and unreachable deductions.
- [ ] Five or more unfamiliar test players can solve without coached interpretation.
- [ ] Key clues accessible with screen reader and scalable text.

## Risks and mitigation
**High:** weak logical proof (especially badge ≠ badge user) → explicitly scope conclusion to best-supported reconstruction or add positive ID. **High:** writing cost → author one robust case before scaling. **Medium:** mobile board complexity → two-fact compare instead of drag graph. **Medium:** changes to case JSON invalidate saves → stable IDs and content-version migrations. **Medium:** premature billing/backend → defer until fun is verified.

## Immediate next action
After merging planning PR, scaffold Expo and unit-test package in a small PR. Import previous exploratory engine ZIP **only after independent review and tests**; it is not part of this documentation PR.
