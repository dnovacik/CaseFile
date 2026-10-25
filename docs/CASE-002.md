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
Initial evidence **E01–E08** is available for inspection; **E09** is hidden until A01. Each fact is a separate, selectable excerpt. The lines marked `F..` are the **exact text the player sees**, not invisible designer assertions.

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

**E06 Parcel-room inventory slip (Document, initial).** Printed by the desk printer at 18:17, the contemporaneous slip lists RX-4814 and RX-4815 on the **public collection shelf**, and RX-4816 in **back parcel room / quarantine tray Q**. It is an inventory record, **not a record of who moved the parcel**. The slip was left on the counter for staff to check.
- **F06A:** “The 18:17 inventory slip places RX-4816 in the back parcel room, quarantine tray Q.”
- **F06B:** “The same slip places RX-4814 and RX-4815 on the public collection shelf.”
- **F06C:** “The inventory slip records a location, not the identity of the person who moved the parcel.”

**E07 Parcel-room access and floor plan (Digital/document, initial).** Building plan shows one staffed entrance to the back parcel room from behind the reception counter, with no second door, external window, or resident access. A mechanical latch is operated from the reception side; **no individual-use access log exists**. The room has no CCTV; the public lobby camera shows only the front entrance, not the counter or room. The public shelf is accessible to residents; the back room is not.
- **F07A:** “The back parcel room has one entrance behind reception; residents cannot enter it.”
- **F07B:** “There is no individual-use door log or camera view inside the back parcel room.”

**E08 Café receipt (Document, initial; deliberate red herring).** A receipt for two coffees from the ground-floor café at 18:09, left on the counter. It has no name and no link to the parcel. No relationship or accepted proof set uses this item.
- **F08A:** “A café receipt records two coffees purchased at 18:09; it does not name a buyer or mention a parcel.”

**E09 Consented tray-Q inspection and Mara's acknowledgement (Physical/document/testimony bundle, hidden; revealed by A01).** With the building manager's authorization and Mara present, investigators inspect **quarantine tray Q** at 19:38. They recover an **unopened** parcel bearing intact label **RX-4816 / Leah Moreno / 4B**, matched to the courier receipt; the package seal is intact. Mara volunteers a signed note in her own handwriting, written at 18:16: “Shelf wet. Moved RX-4816 to tray Q. Tell Leah.” Mara acknowledges writing it and personally moving the parcel, then forgetting to update the resident. Her admission is **direct testimony**, independently corroborated by the parcel and note, not an inference from a log, signature image or photograph alone.
- **F09A:** “At 19:38 an unopened parcel labelled RX-4816 for Leah Moreno, flat 4B, was recovered from quarantine tray Q.”
- **F09B:** “Mara says: ‘I moved RX-4816 from the counter to tray Q because the shelf was wet. I wrote the note and forgot to tell Leah.’”
- **F09C:** “The handwritten note, which Mara acknowledges writing at 18:16, says: ‘Shelf wet. Moved RX-4816 to tray Q. Tell Leah.’”
- **F09D:** “The RX-4816 seal was intact when the parcel was recovered.”

**Visibility rules:** E09 has `initial: false`; A01 reveals it as **New**, not **Inspected**. No E09 facts may be compared or used as proof until the player explicitly inspects E09. E08 is irrelevant and should never unlock a deduction.

## Timeline
| Time | Event |
|---|---|
| 18:09 | Unrelated café purchase (E08 red herring) |
| 18:12 | Owen hands over batch including RX-4816 at reception |
| 18:14 | Carrier marks batch delivered to reception; Leah receives notification |
| 18:16 | Nico reports water by public shelf; Mara moves RX-4816 into tray Q and writes note (learned through E09) |
| 18:17 | Desk inventory slip lists RX-4816 in tray Q, other two parcels on public shelf |
| 19:05–19:24 | Statements from Leah, Owen, Mara and Nico |
| 19:38 | After A01, consented inspection recovers intact RX-4816; Mara acknowledges moving it |

## Investigation and deduction graph
**Mandatory path — all three relationship types are required, with stable, order-insensitive fact pairs:**
1. **R01** `contradicts`: **F03B** (“I ... never took RX-4816 into the back parcel room”) × **F06A** (inventory slip puts RX-4816 in back room tray Q) → **D01** “Mara's account of the parcel's location conflicts with the contemporaneous inventory.” This is a discrepancy in accounts, **not** identification of who moved it. `D01.requires.relationshipIds = [R01]`.
2. **R02** `supports`: **F04A** (Nico reports water at 18:16) × **F06A** (parcel is recorded in quarantine tray Q at 18:17) → **D02** “A temporary protective move into quarantine is plausible and worth checking.” This is **circumstantial support**, not proof that Nico or Mara moved it. `D02.requires.relationshipIds = [R02]`.
3. **A01 — Request consented inspection of quarantine tray Q**: available **only after D01 + D02**. Justification shown to player: “The inventory conflicts with the concierge's account, and a water incident may explain why a parcel was quarantined. Ask the building manager and concierge for permission to inspect tray Q.” Action obtains permission, then reveals **E09**; it does not auto-inspect it.
4. **R03** `same_event`: **F05A** (handover receipt for RX-4816) × **F09A** (recovered parcel with the **same unique RX-4816 identifier**) → **D03** “The parcel recovered in tray Q is the parcel handed to Riverside reception.” The two facts refer to the **same parcel/delivery event**, not two unrelated deliveries. `D03.requires.relationshipIds = [R03]`.
5. **R04** `supports`: **F09B** (Mara's direct acknowledgement of moving RX-4816) × **F09C** (her acknowledged contemporaneous note describing that move) → **D04** “Mara personally moved RX-4816 into tray Q.” `D04.requires.relationshipIds = [R04]`, plus `deductionIds = [D03]` to establish the parcel identity.

**Mandatory deductions:** D01, D02, D03, D04. D01/D02 justify the sole follow-up; D03/D04 support the final conclusions. The mandatory chain requires **R01 (`contradicts`), R02 (`supports`), R03 (`same_event`), and R04 (`supports`)**.

**Optional relationships and deductions:**
- **R05** `supports`: F02A (courier handed parcel over counter) × F05A (matching handover receipt) → **D05** “The courier's account of reception handover is corroborated.” Optional.
- **R06** `supports`: F01B (recipient never collected) × F05B (delivery status was reception-only) → **D06** “A delivered notification does not establish resident collection.” Optional.
- **R07** `supports`: F07A (no resident access to back room) × F09A (parcel recovered inside it) → **D07** “A resident taking it from the public shelf is not the best-supported explanation.” Optional; requires A01 by E09 visibility.
- No authored relationship involves E08. Wrong comparisons receive neutral feedback.

**Reachability / non-spoiler gating:** The player can inspect E03, E04, E05, E06 initially; establish R01 and R02; unlock D01/D02; perform A01; inspect E09; link R03 and R04; unlock D03/D04; submit both conclusions. No deduction needs a hidden fact before A01, and no follow-up requires its own revealed evidence. The UI must never supply relationship answers or identity through metadata.

**Two final-report conclusions** (one choice per conclusion; shared selected-proof IDs, engine-validated):

| ID | Player-facing question | Choices (IDs) | Correct | Required deductions | Accepted proof sets | Supporting proof IDs |
|---|---|---|---|---|---|---|
| **C01** | “Who most likely last handled RX-4816 after reception accepted it?” | `mara` Mara Voss; `owen` Owen Park; `nico` Nico Bell; `leah` Leah Moreno | `mara` | D03, D04 | `[E09]` or `[E05, E09]` | E03, E04, E06, D01, D02, D03, D04 |
| **C02** | “What best explains the parcel's disappearance from the collection area?” | `quarantine` Moved to back-room quarantine tray Q; `doorstep` Left at flat 4B; `resident_theft` Taken from public shelf by a resident; `courier_error` Never handed over at Riverside | `quarantine` | D01, D02, D03 | `[E06, E09]` or `[E09, D03]` | E01, E02, E05, E07, D01, D02, D03, D04 |

**Proof-selection semantics:** Each bracketed array above is one complete accepted proof set; supporting IDs are optional, not a replacement for a complete set. The engine accepts a shared selection only if **each** conclusion has a fully contained accepted set and **every** selected ID belongs to an accepted set or a supporting list. E08 is not allowed: selecting everything fails. The player must have inspected all selected evidence. The minimum is **one proof item** at UI level; actual acceptance follows authored proof sets and prerequisites, not a fixed count.

**Alternatives explicitly addressed by player-visible evidence:**
- **Courier never delivered / wrong building:** E02 + E05 document reception handover; E09 independently confirms the uniquely labelled parcel was on-site.
- **Left outside flat 4B / doorstep theft:** E02 states no upstairs delivery; E05 says the delivered status is for reception, not the flat.
- **Leah or her household already collected it:** E01 says no collection; E06 places it in the restricted back room; E09 recovers it there unopened.
- **Another resident took it from public shelf:** E06 puts RX-4816 in back-room tray Q rather than on public shelf; E07 establishes restricted access; E09 physically recovers it there.
- **Nico took it because he reported water:** E04 reports the leak but denies handling parcels; E09 provides Mara's first-person acknowledgement and her corroborating note. The water report is not identity proof.
- **Mara stole or opened the contents:** E09 confirms the parcel remained sealed; her admission and note support protective relocation, not theft. Her earlier denial is explained by an attempt to avoid admitting the missed resident notification, but motive is not needed to solve the case.
- **Log/receipt/photo alone identifies a culprit:** Neither E05 nor E06 identifies who moved the parcel; E07 has no identifying camera view. C01 relies on **Mara's direct acknowledgement corroborated by E09**, not credential assignment or image-based identification.

**Narrative solution:** The carrier legitimately delivered RX-4816 to Riverside reception. Water began dripping beside the public collection shelf. Mara moved RX-4816 into the back parcel room's quarantine tray Q, wrote a reminder but failed to tell Leah. The batch-level “delivered” notification was accurate about handover, not about resident receipt. The missing parcel was **misplaced, not stolen**.

### Identity and residual-uncertainty caveat
Mara acknowledges moving the parcel and writing the note, and the exact parcel is found in tray Q; this is much stronger than inferring identity from an access log or photograph. No camera captures the physical move, so an independent eyewitness account of the move is unavailable. The reconstruction is **best supported**, not mathematically certain. We cannot infer why Mara initially denied moving it beyond her own account; the case does not establish malicious intent. The exact origin of the drip is unverified and irrelevant to the outcome.

## Secondary narrative
An unrelated maintenance notice mentions a contractor whose billing address is associated with **The Meridian Trust**. It is optional worldbuilding, has no fact ID used by mandatory relationships, and must not appear in accepted proof sets. Do not suggest the organization caused the missing parcel.

## Final report design
Three inputs: **who last handled the parcel**, **what happened to it**, and **select supporting proof**. Gate submission by D01–D04, check the authored accepted proof sets per conclusion, and reject irrelevant extras without revealing the hidden answer. Wrong attempts return neutral feedback and allow retries. Resolution walks through receipt vs notification → inventory discrepancy → water incident → justified consented inspection → same-parcel match → Mara's acknowledgement. **Do not display E09 or the answer before A01 and inspection.**

## Case art
Use the IDs, filenames, sizes and status conventions of [ART-PROMPTS.md](ART-PROMPTS.md): **L = 1536×1024**, **P = 1024×1536**, **S = 1024×1024**; all assets **TODO**. Apply its photographic modern neo-noir, brass/abyss palette, no-unapproved-text, no-invented-clues and clue-equivalent alt-text rules. These are production prompts for future generation, **not** images included in this PR.

**Case facts art must respect:** Riverside Apartments is contemporary, with a public collection shelf next to a staffed reception counter and a **single-door, staff-only back parcel room** accessed behind reception. No door to the apartments connects to the parcel room. There is **no CCTV view inside or behind the reception counter**. A water drip affected the area beside the public shelf. RX-4816 is **never** shown outside flat 4B. Before the follow-up, no image may disclose the parcel in tray Q or who moved it.

**Recurring objects:** RX-4816 is a medium rectangular kraft cardboard box, intact brown packing tape, small dent on one lower corner, white shipping label for **RX-4816 / LEAH MORENO / 4B** (readable only when specifically allowed). Quarantine tray Q is a dark grey shallow plastic bin on a metal shelf in the back parcel room. Reception has a walnut counter and brass desk lamp; the public shelf is a separate low metal rack. The drip is near the public shelf, **not inside the sealed parcel**.

### C02-BRIEFING — Briefing header · L · TODO
File: `case-02-briefing.png`. A vacant section of the apartment lobby's public collection shelf beside a slightly damp tiled floor; brass lamplight from reception. The missing parcel is **not present**.
- **Must:** bottom third dark and quiet for title overlay; contemporary building.
- **Must not:** RX-4816, people, revealing back-room tray, text.

### Locations — L · TODO
- **C02-LOC-EXTERIOR** → `case-02-loc-exterior.png`: Riverside Apartments exterior at blue hour, residential lobby glowing warmly through glass. **Must:** believable modern apartment building; lower half suitable for overlay. **Must not:** readable unrelated signage, courier identifiable as culprit.
- **C02-LOC-LOBBY** → `case-02-loc-lobby.png`: reception counter, public collection shelf and a modest damp patch with caution sign; doorway behind counter leads to staff-only back room but reveals **no contents**. **Must:** one staff doorway; no second route. **Must not:** visible RX-4816, CCTV looking into parcel room, extra entrances.
- **C02-LOC-PARCEL** → `case-02-loc-parcel-room.png`: general back parcel room interior with metal racks and closed opaque grey bins, photographed before consented inspection. **Must:** no visible parcel labels or open bins. **Must not:** expose tray-Q contents or hidden evidence.
- **C02-LOC-CORRIDOR** → `case-02-loc-corridor.png`: empty residential corridor with flat doors, no parcel on any doorstep. **Must:** calm, ordinary residential space. **Must not:** suggest parcel was delivered upstairs.

### Cast portraits — S · TODO
Template: consistent head-and-shoulders portraits, neutral expressions, slightly off-camera right, identical low-key tungsten/blue-black lighting and background. No facial expression should pre-judge guilt.
- **C02-CAST-LEAH** → `case-02-cast-leah.png`: resident, early 30s, curly dark hair, muted rust cardigan, concerned but composed.
- **C02-CAST-OWEN** → `case-02-cast-owen.png`: courier, late 20s, close-cropped hair, charcoal delivery jacket without branding, tired and matter-of-fact.
- **C02-CAST-MARA** → `case-02-cast-mara.png`: concierge, mid 40s, straight shoulder-length brown hair, slate blazer over cream blouse, professional and calm.
- **C02-CAST-NICO** → `case-02-cast-nico.png`: cleaner, late 50s, greying beard, plain dark work polo, practical and reserved.
- **Must:** consistent faces/clothing across any future evidence image. **Must not:** villain coding, invented name tags or logos.

### Evidence photos — L unless specified · TODO
- **C02-E05** → `case-02-e05.png` · L: clinical documentation photo of a batch handover receipt on the reception counter. **Allowed text only:** `RX-4814`, `RX-4815`, `RX-4816`, `Riverside reception`, `18:12`, `18:14`. **Must:** legible exact strings if rendered. **Must not:** personal signature/face implying who moved RX-4816, apartment doorstep.
- **C02-E06** → `case-02-e06.png` · L: printed inventory slip with two public-shelf entries and one quarantine entry. **Allowed text only:** `RX-4814`, `RX-4815`, `RX-4816`, `18:17`, `Q`, `BACK PARCEL ROOM`, `PUBLIC SHELF`. **Must:** RX-4816 clearly associated with Q, others with public shelf. **Must not:** a person named as mover or hidden recovery.
- **C02-E07** → `case-02-e07.png` · L: plain building floor plan and photo of a single staff-only back-room door behind reception, without readable names. **Must:** one entry, no resident route; alt text repeats the single-entry fact. **Must not:** CCTV angle of parcel room or extra exit.
- **C02-E08** → `case-02-e08.png` · L: innocuous café receipt beside an empty cup on the reception counter. **Allowed text:** `18:09`. **Must:** visibly mundane, no clues connecting it to the parcel. **Must not:** identity, parcel number or Meridian Trust logo.
- **C02-E09** → `case-02-e09.png` · L: **spoiler / post-A01 only** forensic documentation photograph of intact RX-4816 in open grey tray Q, alongside Mara's handwritten note (show note as non-legible handwriting; the app supplies the exact quoted transcription). **Allowed readable label text only:** `RX-4816`, `LEAH MORENO`, `4B`. **Must:** same dent, intact seal and tray as recurring objects; evidence revealed only after A01; alt text conveys parcel identity and intact condition. **Must not:** person physically shown moving the parcel, altered tape, invented note wording.

## Case QA checklist
- [x] Define stable fact IDs and exact proposed player-visible English fact excerpts (E01–E09).
- [x] Use all three relationship types on the mandatory path, with explicit pairs and prerequisites.
- [x] Gate exactly one justified action; revealed evidence is not auto-inspected.
- [x] Define two final conclusions, complete accepted proof sets and supporting proof IDs.
- [x] Explicitly address non-delivery, doorstep theft, resident collection, neighbour theft, cleaner involvement and deliberate theft in player-visible evidence.
- [x] Avoid identification from a log, credential or photo alone; require direct acknowledgement corroborated by recovery.
- [x] Include an irrelevant red herring (E08), excluded from all proof.
- [ ] Convert to versioned case JSON, localized strings and asset IDs.
- [ ] Run schema validator, full-path solver and proof-subset tests (including irrelevant-extra rejection).
- [ ] Blind-review whether R01 is fair as a contradiction between testimony and a location record, and R02 is semantically a support link rather than causal proof.
- [ ] Check every art asset and accessible alt text against the case facts.
- [ ] Cold-playtest with 5–10 unfamiliar players; tune for 8–10 minutes.
