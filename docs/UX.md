# Screen-by-screen UX and neo-noir visual identity

## Palette
| Color | Hex | Use |
|---|---|---|
| Abyss | `#101318` | Background |
| Slate | `#1B222B` | Cards and surfaces |
| Brass | `#C9A46B` | Selected facts, discoveries |
| Crimson | `#A63838` | Caution (never sole indicator) |
| Ivory | `#E8E2D8` | Primary copy |

**Style:** modern, believable noir investigative software; photographic case assets, restrained contrast and accents. Avoid fake unreadable microtype, noisy textures behind text, flashy gradients and excessive ornamental string-board UI.

## Screens and interactions
1. **Case Library:** progress, cases, completion state, difficulty, free/paid status, resume affordance.
2. **Case Briefing:** atmospheric hero, case number, setting/time, central mystery and clear start action.
3. **Evidence Workspace:** category filter, inspected/unseen state, cards for testimony/document/photo/digital/physical evidence, easy board access.
4. **Evidence Detail:** full document/photo/message reader, highlighted or accessible list of extractable individual facts. Critical photo info available in descriptions.
5. **Guided Compare Sheet:** two inspected facts + excerpts; choose supports / contradicts / same event; analyze; neutrally acknowledge valid/unsubstantiated link.
6. **Deduction Board:** compact readable chain/list of confirmed discoveries, open questions, and available follow-up actions; show uncertainty distinctly.
7. **Follow-up Action:** explicit investigative justification, confirm action, reveal newly obtained evidence without implicit inspection.
8. **Final Report:** answer suspect/entry method, select evidence, check proof requirements, retry incomplete submissions.
9. **Resolution:** full reconstruction and why the evidence matters, missed optional links, progress and next case.

Navigation: Library → Briefing → Workspace ↔ Compare / Deduction Board ↔ Actions → Report → Resolution. Avoid navigation paths that discard in-progress decisions.

## Accessibility and device UX
Portrait-first, one-hand reach, minimum 44pt targets, dynamic text, screen reader labels and role announcements, reduced motion, avoid color-only state, safe-area padding, optional ambience. Photo zoom is supplemental; do not make mandatory clue dependent on visual acuity. Autosave on meaningful transitions and recover interruptions.

## Motion
Reanimated card/sheet transitions, quiet link-confirmation pulse and subtle file unlock. Use motion only for hierarchy and feedback. Sound and film grain can be toggled off.

## Mockup order
Produce independent mobile screen mocks using **actual Case 001 text** for Library, Evidence, Compare, Deduction Board, Report and Resolution. Review visual usability on a real 6-inch phone before programming polished animation.
