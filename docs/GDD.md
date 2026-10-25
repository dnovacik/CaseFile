# CASEFILE: FIVE MINUTES — Game Design Document
Version 0.3 | Design baseline | 25 October 2026

## High concept
A premium-feeling detective game made for 5–10-minute mobile sessions. Open independent case files, inspect documents, photographs, records and testimony, link facts, uncover contradictions, reconstruct events, and submit a conclusion supported by evidence. A case must always be fair: the mandatory solution is discoverable, not guessed.

## Locked product decisions
- Guided deduction (select two facts and classify: `contradicts`, `supports`, `same_event`).
- Neo-noir modern investigative-software look rather than a literal corkboard.
- Hybrid storytelling: each case resolves independently; optional recurring organizations and motifs develop a secondary narrative.

## Pillars
1. **Reason, don't guess.** No culprit selection without supporting proof.
2. **Short and satisfying.** Target 5–10 minutes, without punishing slow readers.
3. **Believable tools.** Evidence cards, records, photo viewers, compact deduction board.
4. **Content-first engine.** JSON-defined case packs, independent of UI code.
5. **Offline-first and respectful.** No energy system, forced ads or network requirement.

## Core loop
Case Library → Briefing → Evidence Inspection ↔ Fact Comparison ↔ Deduction Board → Follow-up Investigation Actions → Final Report → Resolution.

During comparison, select two inspected facts, choose the relationship type and analyze. Correct links become discovered relationships; rule prerequisites unlock deductions. Wrong links receive neutral non-spoiling feedback without penalty. Follow-up actions can reveal new evidence, but always require authored justification. The final report asks who, how and what proves the reconstruction.

## Evidence taxonomy
Testimony, document, digital record, photograph, physical object and timeline. Each item has a stable ID, localized presentation content, zero or more extractable facts, optional images/alt text and unlock conditions. Fact-level links prevent ambiguous document-level comparisons. Evidence can be visible, inspected and/or unlocked—distinct states.

## Reasoning layers
1. **Evidence:** what sources actually report.
2. **Relationships:** validated pair of facts, classified by kind.
3. **Deductions:** authored conclusions unlocked by required relationships, facts, previous deductions or investigative actions.
4. **Conclusions:** final answers and an accepted supporting evidence set.

A credential record does not prove who physically used the credential. A printer job does not establish physical presence. Distinguish observation, suspicion, inference and proof. Explicit alternative explanations must be tested by case authors.

## Hints and score
Three hint stages: nudge toward category; focus two facts; reveal a relationship. Never spoil answers with failure messages. Optional three-tier case rating rewards independent reasoning (fewer hints and retries), not speed. Preserve elapsed time for personal statistics only. Support resumable play and repeated case reading.

## Proposed opening collection
| # | Working title | Premise |
|---|---|---|
| 01 | The Missing Watch | Watch disappears from locked gallery office |
| 02 | Last Delivery | Missing parcel recorded as delivered |
| 03 | The Empty Room | Hotel guest vanishes without apparent exit |
| 04 | 21:37 | Office log challenges an alibi |
| 05 | The Forged Signature | Contract alteration dispute |
| 06 | Silent Alarm | Museum alarm failure during theft |
| 07 | The Wrong Photograph | Photo exposes false timeline |
| 08 | Dead Air | Discrepancy in radio exchange |
| 09 | The Final Passenger | Passenger records and witness accounts diverge |
| 10 | Paper Trail | Minor bookkeeping discrepancies reveal fraud |

These are *premises*, not solved/verified mysteries. Difficulty: Rookie (1–3, ~5–9 clues, 1–3 deductions), Detective (4–7, ~8–12 clues, 3–4 deductions), Inspector (8–10, ~12–16 clues, 4–6 deductions). Actual play length and density require testing.

## Hybrid narrative
Each case includes a fully satisfying resolution. A recurring but optional organization—provisionally **The Meridian Trust**—may appear in an invoice or background artifact, creating an evolving mystery. Meta-clues do not gate the core investigation. Maintain a story bible for continuity.

## UX / aesthetics
Portrait Android/iOS. Dark surfaces, restrained brass highlights, ivory text, occasional crimson warning; realistic noir evidence photography, subtle motion and ambience. Avoid excessive grain around text, tiny controls, mandatory gestures or convoluted connection wires. Details in [UX.md](UX.md).

## Technical architecture
Expo + React Native + TypeScript and Expo Router; React Native Reanimated for gestures; Zustand for in-memory session/UI state; SQLite for durable progress. **Pure TypeScript engine** consumes versioned JSON packs; no RN or network dependency. Localized strings and referenced assets live beside content. Backend is optional only for future downloads or syncing. No sign-in required for initial version.

## Accessibility / resilience
Dynamic type, large targets, screen-reader facts and state announcements, reduced-motion mode, photo alt descriptions containing all mandatory clues, color-independent status cues, offline bundled assets, autosave on meaningful actions, interruption-safe resume. Proper content-version migrations are required before releasing updated case packs.

## Monetization
Free first 2–3 cases; one-time unlock of the first collection; optional paid case packs after validation. Restore entitlements across reinstallation. No ads, energy, consumable hints or pay-to-win.

## Main risks
Biggest risk is authored-mystery quality and QA, not interface engineering. Other risks: ambiguous clue semantics, unrewarding links, overcrowded screens, content pipeline drift and billing distraction. Mitigate by proving Case 001 with cold player tests before generating all ten.

## Success criteria
Players independently make evidence-based discoveries, understand why their answer is correct, can finish and resume offline, and find the neo-noir atmosphere legible and polished. Proposed initial evaluation: 5–10 cold playtesters; record completion, friction, wrong links and time. Avoid rigid numerical targets before baseline testing.
