# Case 001 — The Missing Watch (designer spoilers)
**Setting:** Blackwood Gallery, private office; 17 October 2026.
**Level:** Rookie. **Target length:** 8–10 minutes.
**Current status:** authored as data in `content/cases/case-001/` (definition + English strings); passes the validator and full-path solver with no issues. **Not yet playtested.** The player-visible wording lives in `en.json`; this doc is the design summary.

## Briefing
At 20:40, gallery owner Adrian Vale leaves his engraved silver wristwatch in an unlocked desk drawer and exits his private office. The door auto-locks. When he returns at 21:20, the office is locked, no forced entry is visible, and his watch is missing. Three staff members might have access.

## Cast
- **Adrian Vale**, owner and reporting witness.
- **Marcus Reed**, gallery manager; access badge M-04 opens the office.
- **Elena Cross**, curator; standard badge doesn't open office.
- **Thomas Bell**, security officer; emergency key in monitored sealed cabinet.

## Evidence
**E01 Adrian's statement, interviewed 21:32:** “I placed the watch in the top drawer of my desk at 20:40. I closed the drawer but didn't lock it. Then I went downstairs to greet our guests. When I returned at 21:20, the office door was locked, but the watch was gone.” He didn't lend or remove the watch after 20:40; drawer was undamaged. The office is on the second floor and its windows are fixed panes that do not open.

**E02 Marcus's statement, 21:41:** “I was in the print room the whole time, from about 20:45 until 21:15. The exhibition catalogues needed finishing. My access badge stayed clipped to my jacket. I didn't go anywhere near Adrian's office.” M-04 is assigned to Marcus.

**E03 Elena's statement, 21:46:** on the exhibition floor until just before nine, then preparing labels in the storage room from about 20:55 until around 21:10. At about 20:47 she saw Marcus go through the staff door to the back stairs up to the offices, away from the print room. (Moved from “just before nine”: that conflicted with her storage-room time and fell after the theft.)

**E04 Thomas's statement, 21:52:** “I remained at the security desk from 20:30 until 21:15. The emergency office key stayed inside its sealed cabinet. Nobody reported a problem with the office door that evening.”

**E05 Office log:** 20:40 Adrian leaves, door locks; 20:48 badge M-04 accepted to unlock; 20:52 door closes and locks; 21:20 Adrian authorized unlock. System online/synchronized. A badge log tracks **credential use**, not necessarily **human identity**.

**E06 Print server report:** 20:46 job submitted from Marcus's workstation; 20:47 print starts; 20:56 finishes; 21:12 pages collected (collector unknown). Printer runs unattended; proves submission, not continuous presence.

**E07 Guest corridor photograph:** timestamp 20:51; taken on a guest's phone after they wandered through an unmarked staff door looking for the cloakroom. Shows the staff back corridor leading from the private office: a dark-suited person walking away, backlit, face obscured. Several men at the exhibition wear dark suits (including Adrian and Marcus). Does **not** identify Marcus. Production asset needs clue-equivalent alt text.

**E08 Security desk:** the emergency key cabinet holds eight keys (the office key is on hook 2) behind one tamper seal; seal 007342 intact at 20:30 and 21:15; cabinet sensor reported no opening. CCTV covers the public galleries and main stairwell only; the staff wing (back corridor, print room, storage room, private office) has no cameras. Thomas radio responses 20:49, 21:02. Does not prove continuous location, but weighs against emergency-key entry.

**E09 Watch recovery (unlocked later):** 22:05 consented inspection of Marcus's belongings finds Adrian's engraved silver watch inside zipped compartment of Marcus's jacket; engraving matches owner documents. Marcus confirms jacket stayed with him; nobody else handled it. Not immediately visible; unlocked by justified investigative action A01.

## Timeline
| Time | Event |
|---|---|
| 20:40 | Adrian leaves watch in desk drawer and exits |
| 20:46 | Marcus's workstation (in the print room) submits print job |
| 20:47 | Elena sees Marcus take the back stairs toward the offices |
| 20:48 | M-04 used at office |
| 20:51 | Unknown dark-suited figure photographed near corridor |
| 20:52 | Office locks |
| 20:56 | Unattended print job completes |
| 21:12 | Pages collected by unknown person |
| 21:20 | Adrian discovers missing watch |
| 22:05 | Watch found in Marcus's jacket after A01 |

## Investigation and deduction graph
Mandatory path (uses all three relation types):
1. **R01** `contradicts`: F02C Marcus says he went nowhere near the office × F05B badge M-04 (assigned to Marcus) unlocked the office at 20:48 → **D01** Marcus's badge account is questionable (either he was there, or his badge was).
2. **R02** `supports`: F02B Marcus says he was in the print room 20:45–21:15 × F06A the job was sent from his print-room workstation at 20:46 → with F06B (printer then ran unattended) **D02** The print job is not an alibi.
3. **A01** Request a consented search, available once D01 + D02 hold; reveals **E09** (not auto-inspected).
4. **R03** `same_event`: F01A Adrian's watch in the drawer × F09A the watch found in Marcus's jacket → **D03** Marcus had Adrian's watch.
5. **R05** `supports`: F02A Marcus says badge M-04 stayed clipped to his jacket × F09B Marcus says the jacket never left him → with D01, **D04** Nobody else had badge M-04.

Optional links: **R04** E07 photo 20:51 × office locked 20:52 → D05; **R06** Elena saw Marcus on the back stairs × his print-room claim (`contradicts`) → D06; **R07** Thomas's key claim × intact seal 007342 → D07.

**Final report:** C01 who → Marcus (requires D03 + D04; proof E05 + E09). C02 how → badge M-04 (requires D01; proof E05). Relevant extra proof is accepted (E02, E03, E06, E01, E04, E08 and deductions), but **E07 is not**: the photo identifies nobody, so citing it, or selecting everything, fails the report.

**Narrative solution:** Marcus sent the print job for apparent cover, went up the back stairs, used his own badge at 20:48 and left by 20:52. A private debt is disclosed after the case as motive, never as proof.

### Identity caveat — resolved
Badge ownership and the access log alone don't prove Marcus used M-04. The case closes that gap with **D04**, built from Marcus's own statements: the badge stayed on his jacket, and the jacket never left him. Naming Marcus requires D04 (content test enforces it), the questions ask who *most likely* did it, and the resolution states the remaining uncertainty.

## Secondary narrative
Optional background invoice names **The Meridian Trust**. It is worldbuilding only; unrelated to the mandatory solution and cannot block case completion.

## Final report design
Three inputs: suspect, entry method, select supporting evidence. Gate submission by mandatory deductions. Wrong attempts give neutral feedback and allow retries. Resolution explains statement → log discrepancy → printer misconception → justified follow-up → watch recovery → reconstruction. Explain residual uncertainty honestly.

## Case QA checklist
- [x] Convert sources to stable fact IDs and exact player-visible excerpts.
- [ ] Verify all three relationship types are semantically defensible.
- [ ] Validate A01 unlock does not magically produce unsupported evidence.
- [x] Remove or clarify weak identity inference before release (D04).
- [ ] Rule out alternative entry routes in player-visible evidence (fixed windows, sealed emergency key, no CCTV in the staff wing).
- [ ] Check every art asset against the case facts (see [ART-PROMPTS.md](ART-PROMPTS.md)).
- [x] Run validator and full graph simulation (`content/__tests__/case-001.test.ts`).
- [ ] Cold-playtest with players unfamiliar with the intended solution.
- [ ] Confirm expected 8–10-minute experience and accessible photo clues.
