# Case 001 — The Missing Watch (designer spoilers)
**Setting:** Blackwood Gallery, private office; 17 October 2026.
**Level:** Rookie. **Target length:** 8–10 minutes.
**Current status:** authored narrative and reasoning specification, **not yet playtested or mechanically proven airtight**.

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

**E03 Elena's statement, 21:46:** “I was preparing labels in the storage room from 20:55 until around 21:10. Before that, I was on the exhibition floor. I saw Marcus heading toward the back corridor just before nine, but I didn't think anything of it.”

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
| 20:46 | Marcus's workstation submits print job |
| 20:48 | M-04 used at office |
| 20:51 | Unknown dark-suited figure photographed near corridor |
| 20:52 | Office locks |
| 20:56 | Unattended print job completes |
| 21:12 | Pages collected by unknown person |
| 21:20 | Adrian discovers missing watch |
| 22:05 | Watch found in Marcus's jacket after A01 |

## Investigation and deduction graph
1. **R01:** Compare Marcus's badge/whereabouts account (E02 fact) with authorized M-04 use (E05 fact). Label as a **discrepancy**, not proof that Marcus personally entered. Proposed relationship `contradicts` needs carefully authored fact wording and blind review.
2. **D01:** Marcus's badge-related account is questionable.
3. **R02:** Compare claim of staying in print room (E02) with unattended print process (E06). Use `supports` for “print job does not corroborate continuous presence,” not a strict contradiction.
4. **D02:** Print records are insufficient alibi proof.
5. **A01:** Once D01 + D02 established, request consented examination of Marcus's belongings; unlock E09.
6. **R03:** Match E01 identity/absence of watch with E09 serial-matched recovery and possession; `supports`.
7. **D03:** Marcus possessed the missing watch.
8. **Final report:** Most strongly supported suspect Marcus; most likely entry with authorized badge M-04; supporting evidence E05 + E09 and deductions D01–D03.

**Narrative solution:** Marcus took the watch, submitted the print job to create apparent cover and used office access; a private debt may be disclosed in a *post-case confession*, not used as proof of the theft.

### Logical caveat (must resolve before shipping)
Badge ownership + access log + watch recovery strongly support Marcus's responsibility but do not **independently prove** his body was the one operating M-04. Either formulate the player's question as **best-supported reconstruction**, or add a decisive face/identity authentication clue. Do not claim mathematical certainty or legal proof from uncertain records. The current E07 photo isn't enough.

## Secondary narrative
Optional background invoice names **The Meridian Trust**. It is worldbuilding only; unrelated to the mandatory solution and cannot block case completion.

## Final report design
Three inputs: suspect, entry method, select supporting evidence. Gate submission by mandatory deductions. Wrong attempts give neutral feedback and allow retries. Resolution explains statement → log discrepancy → printer misconception → justified follow-up → watch recovery → reconstruction. Explain residual uncertainty honestly.

## Case QA checklist
- [ ] Convert sources to stable fact IDs and exact player-visible excerpts.
- [ ] Verify all three relationship types are semantically defensible.
- [ ] Validate A01 unlock does not magically produce unsupported evidence.
- [ ] Remove or clarify weak identity inference before release.
- [ ] Rule out alternative entry routes in player-visible evidence (fixed windows, sealed emergency key, no CCTV in the staff wing).
- [ ] Check every art asset against the case facts (see [ART-PROMPTS.md](ART-PROMPTS.md)).
- [ ] Run validator and full graph simulation.
- [ ] Cold-playtest with players unfamiliar with the intended solution.
- [ ] Confirm expected 8–10-minute experience and accessible photo clues.
