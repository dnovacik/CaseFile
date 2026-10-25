# Case 002 — Last Delivery (designer spoilers)
**Setting:** Riverside Apartments, lobby parcel room; 22 October 2026.
**Level:** Rookie. **Target length:** 8–10 minutes.
**Current status:** design specification only; not implemented as JSON, validated, solver-tested or cold-playtested. All quoted fact text below is the proposed **exact player-visible English wording** for the future locale file.

## Briefing
At 18:14, resident **Leah Moreno** receives a notification that parcel **RX-4816** has been delivered to Riverside Apartments. It contains a replacement camera lens she needs tomorrow. Nothing is outside her flat or in her mailbox. The courier insists the delivery was completed. Find out **who last handled the parcel** and **where it went**. The building has a staffed parcel room, not doorstep delivery.

## Cast
- **Leah Moreno** (`P_LEAH`), resident of flat 4B and parcel recipient; reported it missing.
- **Owen Park** (`P_OWEN`), delivery courier; handed over a batch at the lobby counter.
- **Mara Voss** (`P_MARA`), evening concierge; says she did not personally move RX-4816.
- **Nico Bell** (`P_NICO`), building cleaner; reported a leak and used the adjacent supply closet.

## Evidence
Initial evidence **E01–E08 and E10** is available for inspection; **E09** is hidden until A01. Each fact is a separate, selectable excerpt. The lines marked `F..` are the **exact text the player sees**, not invisible designer assertions.

**E01 Leah's statement, interviewed 19:05 (Testimony, initial).** “My app said delivered at 18:14. I checked my door, mailbox and the lobby collection shelf. I never collected the parcel, and nobody in my household collected it.”
- **F01A:** “The delivery notification for RX-4816 arrived at 18:14.”
- **F01B:** “I never collected RX-4816, and nobody in my household collected it.”
- **F01C:** “I checked my door, mailbox and the lobby collection shelf; RX-4816 was not there.”

**E02 Owen's statement, interviewed 19:11 (Testimony, initial).** “At 18:12 I handed three parcels, including RX-4816, over the staffed reception counter. The concierge checked the labels. I did not go upstairs or leave any parcel at an apartment door.”
- **F02A:** “At 18:12 I handed RX-4816 over the staffed reception counter.”
- **F02B:** “I did not go upstairs or leave any parcel at an apartment door.”

**E03 Mara's statement, interviewed 19:18 (Testimony, initial).** “I accepted the courier's batch, but I put everything on the public collection shelf. I never took RX-4816 into the back parcel room. The cleaner was working nearby.”
- **F03A:** “I accepted the courier's batch at reception.”
- **F03B:** “I put everything on the public collection shelf. I never took RX-4816 into the back parcel room.”
- **F03C:** “The cleaner was working nearby.”

**E04 Nico's statement, interviewed 19:24 (Testimony, initial).** “At 18:16 I reported water dripping beside the public parcel shelf. I put out a caution sign and dried the floor. I never touched a delivery, and I did not enter the locked parcel room.”
- **F04A:** “At 18:16 I reported water dripping beside the public parcel shelf.”
- **F04B:** “I never touched a delivery, and I did not enter the locked parcel room.”

**E05 Courier handover receipt (Document, initial).** A counter receipt records batch items RX-4814, RX-4815 and **RX-4816**, with a recipient line **“Riverside reception”** at 18:12. The delivery service marked the whole batch delivered at 18:14. The recipient line names a **destination, not a person**. The receipt does not establish what happened after handover.
- **F05A:** “At 18:12 the handover receipt lists RX-4816 among three parcels accepted at Riverside reception.”
- **F05B:** “At 18:14 the delivery service marked the reception batch delivered; it did not record delivery to flat 4B.”

**E06 Public-shelf scan, 18:17 (Digital, initial).** The reception shelf scanner lists RX-4814 and RX-4815 as present, and RX-4816 as **“not found”**. The scan covers only the public shelf: it neither reveals the parcel's whereabouts nor identifies who handled it.
- **F06A:** “At 18:17 the public-shelf scan lists RX-4816 as ‘not found’.”
- **F06B:** “At 18:17 the same scan lists RX-4814 and RX-4815 as present on the public shelf.”
- **F06C:** “The scan checks the public shelf only; it does not say where a missing parcel went or who moved it.”

**E07 Parcel-room access and floor plan (Document, initial).** The building's staff-access policy and floor plan show one entrance to the back parcel room behind reception, no other door or external window. **Only the concierge on reception duty is issued the physical back-room key; cleaners use a separate supply closet and do not have that key.** The back-room door is self-latching, the key is not shared or left at the counter, and the building manager confirms there was no emergency opening or spare-key issue during 18:00–19:00. No individual-use access log exists. No camera views the counter or parcel room.
- **F07A:** “Only the concierge on reception duty can enter the back parcel room; cleaners and residents cannot access it.”
- **F07B:** “The back parcel room has one self-latching entrance behind reception, no other entrance and no camera or individual-use access log.”
- **F07C:** “No spare key was issued and no emergency opening was recorded between 18:00 and 19:00.”

**E08 Café receipt (Document, initial; deliberate red herring).** A receipt for two coffees from the ground-floor café at 18:09, left on the counter. It has no name and no link to the parcel. No relationship or accepted proof set uses this item.
- **F08A:** “A café receipt records two coffees purchased at 18:09; it does not name a buyer or mention a parcel.”

**E09 Consented back-room inspection (Physical, hidden; revealed by A01).** With the building manager's authorization, investigators inspect the back parcel room at 19:38. In quarantine tray Q they recover an **unopened** parcel labelled **RX-4816 / Leah Moreno / 4B**; the identifier matches the handover receipt and the seal is intact. An **unsigned** sticky note on the tray reads “Shelf wet — moved to Q”. Neither the note nor the recovery photo identifies who moved the parcel.
- **F09A:** “At 19:38 an unopened parcel labelled RX-4816 for Leah Moreno, flat 4B, was recovered from back-room quarantine tray Q.”
- **F09B:** “An unsigned sticky note on tray Q says: ‘Shelf wet — moved to Q’.”
- **F09C:** “The seal on RX-4816 was intact when it was recovered.”

**E10 Reception staff rota (Document, initial).** A signed duty rota, corroborated by the building manager's staffing record, names **Mara Voss as the sole reception concierge from 18:00 to 19:00**. Nico Bell was assigned cleaning duties by the public shelf and supply closet; he was **not** authorized to enter the back parcel room. No reception relief, handover or substitute was recorded in this interval. The rota proves duty and access responsibility, **not** by itself the act of moving a parcel.
- **F10A:** “Mara Voss was the only concierge on reception duty between 18:00 and 19:00; no relief or substitute was assigned.”
- **F10B:** “Nico Bell was assigned cleaning duties, not reception or back-room access.”

**Visibility rules:** E09 has `initial: false`; A01 reveals it as **New**, not **Inspected**. No E09 facts may be compared or used as proof until the player explicitly inspects E09. E08 is irrelevant and should never unlock a deduction. E10 is available from the start and must be inspected for its facts to be linked.

## Timeline
| Time | Event |
|---|---|
| 18:00–19:00 | Mara is the only scheduled reception concierge (E10); Nico cleans public areas |
| 18:09 | Unrelated café purchase (E08 red herring) |
| 18:12 | Owen hands over batch including RX-4816 at reception |
| 18:14 | Carrier marks batch delivered to reception; Leah receives notification |
| 18:16 | Nico reports water by public shelf; parcel's movement is **not yet known** |
| 18:17 | Public-shelf scan lists RX-4814 and RX-4815 present, RX-4816 **not found** |
| 19:05–19:24 | Statements from Leah, Owen, Mara and Nico |
| 19:38 | After A01, inspection recovers intact RX-4816 in tray Q with an unsigned note |

## Investigation and deduction graph
**Mandatory path — all three relationship types are required, with stable, order-insensitive player-visible fact pairs:**
1. **R01** `same_event`: **F02A** (Owen hands RX-4816 to reception at 18:12) × **F05A** (the 18:12 receipt records that same uniquely numbered parcel at reception) → **D01** “RX-4816 reached Riverside reception.” `D01.requires.relationshipIds = [R01]`. This establishes the same handover, not the identity of a later handler.
2. **R02** `contradicts`: **F03B** (Mara claims every parcel went onto the public shelf) × **F06A** (RX-4816 is “not found” on the shelf at 18:17) → **D02** “Mara's account of placing every parcel on the shelf is inconsistent with the 18:17 shelf check.” `D02.requires.relationshipIds = [R02]`. The five-minute gap leaves open an intervening removal; the discrepancy does not identify a mover.
3. **R03** `supports`: **F04A** (water by the shelf at 18:16) × **F06A** (RX-4816 missing from shelf at 18:17) → **D03** “The leak provides a plausible reason to move a parcel off the shelf, but its destination is still unknown.” `D03.requires.relationshipIds = [R03]`. This is contextual support, not proof of causation.
4. **R04** `supports`: **F07A** (only the reception concierge can enter the back room) × **F10A** (Mara is the sole concierge 18:00–19:00) → **D04** “Mara was the only authorized back-room handler during the delivery interval.” `D04.requires.relationshipIds = [R04]`, `deductionIds = [D01]`. This narrows opportunity **before** the hidden evidence, without claiming an eyewitness identification.
5. **A01 — Request consented inspection of the back parcel room**: requires **D01 + D02 + D03 + D04**. Player-visible justification: “RX-4816 reached reception but was absent from the public shelf minutes later. A leak could explain a protective move, and only the duty concierge could access the adjacent back room. Request the building manager's permission to inspect it.” A01 reveals **E09** as **New**, never automatically inspected.
6. **R05** `same_event`: **F05A** (RX-4816 received at reception) × **F09A** (same unique parcel recovered in tray Q) → **D05** “The missing delivery was recovered in the back-room quarantine tray.” `D05.requires.relationshipIds = [R05]`, `actionIds = [A01]`.
7. **R06** `supports`: **F09B** (unsigned “Shelf wet — moved to Q” note) × **F04A** (contemporaneous leak report) → **D06** “The recovery and water incident support a protective relocation rather than an uncompleted delivery.” `D06.requires.relationshipIds = [R06]`, `deductionIds = [D05, D04]`. **D04 + D05** provide the strongest supported identification of Mara as the handler; the note itself names nobody.

**Mandatory deductions:** D01–D06. Mandatory relationships R01–R06 include `same_event`, `contradicts`, and `supports`; R01–R04 are **pre-action**. The player reasons about who had access **before** A01, and E09 confirms location and condition, not identity.

**Optional relationships and deductions:**
- **R07** `supports`: F01B (Leah says nobody in her household collected the parcel) × F05B (carrier status only records reception handover) → **D07** “Delivered to reception does not mean collected by the resident.”
- **R08** `supports`: F07A (only reception staff can enter the back room) × F10B (Nico is not reception staff) → **D08** “Nico's presence near the leak does not give him back-room access.”
- No relationship uses E08. Wrong comparisons receive neutral feedback.

**Reachability / non-spoiler gating:** Inspect E02, E03, E04, E05, E06, E07 and E10; link R01–R04; obtain D01–D04; perform A01; inspect E09; link R05–R06; obtain D05–D06; submit both conclusions. There is no prerequisite cycle and no hidden fact is required before the action.

**Two final-report conclusions** (one choice per conclusion; shared selected-proof IDs, engine-validated):

| ID | Player-facing question | Choices (IDs) | Correct | Required deductions | Accepted proof sets | Supporting proof IDs |
|---|---|---|---|---|---|---|
| **C01** | “Who most likely last handled RX-4816 after reception accepted it?” | `mara` Mara Voss; `owen` Owen Park; `nico` Nico Bell; `leah` Leah Moreno | `mara` | D04, D05, D06 | `[E07, E10, E09]` or `[E05, E07, E10, E09]` | E02, E03, E04, E06, D01, D02, D03, D04, D05, D06, D08 |
| **C02** | “What best explains the parcel's disappearance from the collection area?” | `quarantine` Moved to back-room quarantine tray Q; `doorstep` Left at flat 4B; `resident_theft` Taken from public shelf by a resident; `courier_error` Never handed over at Riverside | `quarantine` | D01, D03, D05, D06 | `[E05, E06, E09]` or `[E04, E09, D05]` | E01, E02, E07, E10, D01, D02, D03, D04, D05, D06, D07 |

**Proof-selection semantics:** Each bracketed array is one complete accepted proof set. The shared selection must contain at least one full set for **each** conclusion; extra IDs are allowed only if listed in accepted or supporting sets. **E09 alone never proves C01**. The player must inspect every selected evidence item. E08 is excluded; selecting everything fails. UI permits selection of one or more proof IDs, while the engine enforces the actual sets.

**Alternatives explicitly addressed by player-visible evidence:**
- **Courier never delivered / wrong building:** E02 + E05 establish the unique handover; E09 recovers the same parcel inside Riverside.
- **Left outside flat 4B / doorstep theft:** E02 explicitly rules out upstairs delivery; E05 records reception-only status.
- **Leah or her household already collected it:** E01 denies collection; E06 shows the parcel was not scanned onto the public shelf; E09 recovers it unopened in a restricted room.
- **Another resident took it from the public shelf:** E06 does not establish that RX-4816 was ever placed on that shelf; E07 restricts back-room access; E09 recovers the parcel there.
- **Nico took it because he was beside the leak:** E04 places Nico by the public shelf, but E07 and E10 establish that he had no key or authorization for the back room; E09 places the parcel inside. His opportunity near the shelf remains a fair early suspicion, not proof of moving it into tray Q.
- **Another staff member or building manager moved it:** E10 records no replacement concierge; E07 records no spare-key issue, emergency entry or alternate entrance during the interval. These records limit alternatives but do not independently identify a mover.
- **Mara stole or opened the contents:** E09 shows an intact seal and a contemporaneous-looking, unsigned protective-move note; neither proves intent. The case supports misplacement, not theft.
- **A receipt, rota, credential, or photograph alone identifies Mara:** E05 proves handover, E07 establishes exclusive room access policy, E10 establishes Mara's sole duty and E09 independently confirms where the parcel ended up. **The conclusion requires these together**, not one record alone.

**Narrative solution:** Owen handed RX-4816 to reception. The shelf became wet. The parcel disappeared from the public shelf check, while Mara was the sole person authorized to use the back parcel room. A justified inspection finds RX-4816 unopened in tray Q with an unsigned “Shelf wet — moved to Q” note. The best-supported reconstruction is that Mara moved it for safekeeping and failed to notify Leah; the “delivered” status referred to reception handover, not collection.

### Identity and residual-uncertainty caveat
The mandatory path establishes **exclusive authorized opportunity**, not direct observation of Mara carrying the parcel. E09 independently verifies its location but the note is unsigned. In the **post-report resolution only**, Mara explains that she moved the parcel to protect it from the drip and forgot to update Leah; this explanation is narrative closure, **not an evidence fact or prerequisite for C01**. A stolen or borrowed key, undocumented unauthorized access or inaccurate staff records cannot be excluded with absolute certainty; the final question therefore asks **“most likely”**, never “proved beyond doubt.” No one is identified from a credential, log or photo alone. The leak's exact source and Mara's reason for her earlier incomplete account remain unverified.

## Secondary narrative
No Meridian Trust clue is included in this case. E08 (the café receipt) is the deliberate red herring and has no relationship, deduction or accepted proof set.

## Final report design
Three inputs: **who last handled the parcel**, **what happened to it**, and **select supporting proof**. Gate submission by D01–D06, check the authored accepted proof sets per conclusion, and reject irrelevant extras without revealing the hidden answer. Wrong attempts return neutral feedback and allow retries. Resolution walks through receipt vs notification → public-shelf scan discrepancy → water incident and exclusive staff access → justified consented inspection → same-parcel match → best-supported reconstruction; Mara's explanation appears only after the report. **Do not display E09 or the answer before A01 and inspection.**

## Case art
Use the IDs, filenames, sizes and status conventions of [ART-PROMPTS.md](ART-PROMPTS.md): **L = 1536×1024**, **P = 1024×1536**, **S = 1024×1024**. Status: all assets **DONE** (in `content/assets/cases/case-02-*.webp`) except **C02-E06**, which must be regenerated (see below). Apply its photographic modern neo-noir, brass/abyss palette, no-unapproved-text, no-invented-clues and clue-equivalent alt-text rules. 

**Case facts art must respect:** Riverside Apartments is contemporary, with a public collection shelf next to a staffed reception counter and a **single-door, staff-only back parcel room** accessed behind reception. No door to the apartments connects to the parcel room. There is **no CCTV view inside or behind the reception counter**. A water drip affected the area beside the public shelf. RX-4816 is **never** shown outside flat 4B. Before the follow-up, no image may disclose the parcel in tray Q or who moved it. The initial shelf scan says only **not found** for RX-4816; do not show a tray-Q location on any initial asset.

**Recurring objects:** RX-4816 is a medium rectangular kraft cardboard box, intact brown packing tape, small dent on one lower corner, white shipping label for **RX-4816 / LEAH MORENO / 4B** (readable only when specifically allowed). Quarantine tray Q is a dark grey shallow plastic bin on a metal shelf in the back parcel room. Reception has a walnut counter and brass desk lamp; the public shelf is a separate low metal rack. The drip is near the public shelf, **not inside the sealed parcel**.

### C02-BRIEFING — Briefing header · L · DONE
File: `case-02-briefing.png`. A vacant section of the apartment lobby's public collection shelf beside a slightly damp tiled floor; brass lamplight from reception. The missing parcel is **not present**.
- **Must:** bottom third dark and quiet for title overlay; contemporary building.
- **Must not:** RX-4816, people, revealing back-room tray, text.

### Locations — L · DONE
The accepted parcel-room image showed a ceiling dome camera, which contradicts F07B (no camera in the back room); the ceiling was cropped out. Its floor is also wet although the leak is by the public shelf; regenerate with a dry floor if it is redone.
- **C02-LOC-EXTERIOR** → `case-02-loc-exterior.png`: Riverside Apartments exterior at blue hour, residential lobby glowing warmly through glass. **Must:** believable modern apartment building; lower half suitable for overlay. **Must not:** readable unrelated signage, courier identifiable as culprit.
- **C02-LOC-LOBBY** → `case-02-loc-lobby.png`: reception counter, public collection shelf and a modest damp patch with caution sign; doorway behind counter leads to staff-only back room but reveals **no contents**. **Must:** one staff doorway; no second route. **Must not:** visible RX-4816, CCTV looking into parcel room, extra entrances.
- **C02-LOC-PARCEL** → `case-02-loc-parcel-room.png`: general back parcel room interior with metal racks and closed opaque grey bins, photographed before consented inspection. **Must:** no visible parcel labels or open bins. **Must not:** expose tray-Q contents or hidden evidence.
- **C02-LOC-CORRIDOR** → `case-02-loc-corridor.png`: empty residential corridor with flat doors, no parcel on any doorstep. **Must:** calm, ordinary residential space. **Must not:** suggest parcel was delivered upstairs.

### Cast portraits — S · DONE
Template: consistent head-and-shoulders portraits, neutral expressions, slightly off-camera right, identical low-key tungsten/blue-black lighting and background. No facial expression should pre-judge guilt.
- **C02-CAST-LEAH** → `case-02-cast-leah.png`: resident, early 30s, curly dark hair, muted rust cardigan, concerned but composed.
- **C02-CAST-OWEN** → `case-02-cast-owen.png`: courier, late 20s, close-cropped hair, charcoal delivery jacket without branding, tired and matter-of-fact.
- **C02-CAST-MARA** → `case-02-cast-mara.png`: concierge, mid 40s, straight shoulder-length brown hair, slate blazer over cream blouse, professional and calm.
- **C02-CAST-NICO** → `case-02-cast-nico.png`: cleaner, late 50s, greying beard, plain dark work polo, practical and reserved.
- **Must:** consistent faces/clothing across any future evidence image. **Must not:** villain coding, invented name tags or logos.

### Evidence photos — L unless specified · DONE except C02-E06
**C02-E06 · TODO (regenerate):** the accepted image shifts the status column down one row, so it reads as RX-4814 PRESENT, **RX-4815 NOT FOUND** and RX-4816 with no status, which contradicts F06A/F06B. Each status must sit on the same row as its parcel ID.
- **C02-E05** → `case-02-e05.png` · L: clinical documentation photo of a batch handover receipt on the reception counter. **Allowed text only:** `RX-4814`, `RX-4815`, `RX-4816`, `Riverside reception`, `18:12`, `18:14`. **Must:** legible exact strings if rendered. **Must not:** personal signature/face implying who moved RX-4816, apartment doorstep.
- **C02-E06** → `case-02-e06.png` · L: public-shelf scan printout with two present entries and one missing entry. **Allowed text only:** `RX-4814`, `RX-4815`, `RX-4816`, `18:17`, `PRESENT`, `NOT FOUND`, `PUBLIC SHELF`. **Must:** RX-4816 marked **NOT FOUND**; RX-4814 and RX-4815 marked **PRESENT**. **Must not:** `Q`, back-room location, person named as mover or hidden recovery.
- **C02-E07** → `case-02-e07.png` · L: plain building floor plan and photo of a single staff-only back-room door behind reception, without readable names. **Must:** one entrance, no resident or cleaner access; alt text conveys the exclusive concierge-access rule. **Must not:** CCTV angle of parcel room or extra exit.
- **C02-E08** → `case-02-e08.png` · L: innocuous café receipt beside an empty cup on the reception counter. **Allowed text:** `18:09`. **Must:** visibly mundane, no clues connecting it to the parcel. **Must not:** identity, parcel number or Meridian Trust logo.
- **C02-E10** → `case-02-e10.png` · L: documentary photograph of the reception duty rota. **Allowed text only:** `18:00`, `19:00`, `MARA VOSS`, `RECEPTION`, `NICO BELL`, `CLEANING`. **Must:** Mara is the sole reception concierge for the interval; Nico is assigned cleaning. **Must not:** a signature or image implying that the rota itself proves parcel handling.
- **C02-E09** → `case-02-e09.png` · L: **spoiler / post-A01 only** forensic documentation photograph of intact RX-4816 in open grey tray Q, alongside an **unsigned** sticky note (show note as non-legible handwriting; the app supplies the exact quote “Shelf wet — moved to Q”). **Allowed readable label text only:** `RX-4816`, `LEAH MORENO`, `4B`. **Must:** same dent, intact seal and tray as recurring objects; evidence revealed only after A01; alt text conveys parcel identity and intact condition. **Must not:** signed note, Mara's name or admission, person physically shown moving the parcel, altered tape, invented note wording.

## Case QA checklist
- [x] Define stable fact IDs and exact proposed player-visible English fact excerpts (E01–E10, with E09 hidden).
- [x] Use all three relationship types on the mandatory path, with explicit pairs and prerequisites.
- [x] Gate exactly one justified action; revealed evidence is not auto-inspected.
- [x] Define two final conclusions, complete accepted proof sets and supporting proof IDs.
- [x] Explicitly address non-delivery, doorstep theft, resident collection, neighbour theft, cleaner involvement and deliberate theft in player-visible evidence.
- [x] Avoid identification from a log, credential or photo alone; require combined exclusive-access, rota and recovery evidence, not a single identifying record.
- [x] Include an irrelevant red herring (E08), excluded from all proof.
- [ ] Convert to versioned case JSON, localized strings and asset IDs.
- [ ] Run schema validator, full-path solver and proof-subset tests (including irrelevant-extra rejection).
- [ ] Blind-review R02 as a shelf-scan contradiction despite the intervening five minutes, R03 as circumstantial support rather than proof of causation, and C01's exclusive-access inference for plausible undocumented exceptions.
- [ ] Check every art asset and accessible alt text against the case facts.
- [ ] Cold-playtest with 5–10 unfamiliar players; tune for 8–10 minutes.
