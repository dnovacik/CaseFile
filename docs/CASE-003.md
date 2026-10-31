# Case 003 — The Empty Room (designer spoilers)
**Setting:** The Halden Hotel, city centre, sixth floor; night of 26–27 October 2026.
**Level:** Rookie (upper end; a step up from Case 002). **Target length:** 9–12 minutes.
**Current status:** design only. The deduction graph has been drafted as engine JSON and passes the validator and the full-path solver (all deductions and relationships reachable; wrong answers, select-everything and hidden-evidence-only reports all fail). Case JSON, strings and art are **not yet authored**. **Not yet cold-playtested.**

## What's new compared with Cases 001–002
- **The puzzle is the exit, not the object.** The player eliminates the obvious routes (lobby, fire exit, windows) before finding the third one.
- **One action reveals two items** (a log and a camera still), which must be linked to each other.
- **Seven mandatory deductions** (Case 002 had six) and three optional ones.
- **First appearance of the Meridian Trust** (see GDD, Hybrid narrative): a red-herring compliments slip that gates nothing, plus an unexplained phone call that the resolution leaves open.
- **No crime at the centre.** The missing man left of his own accord; the case is about how, and who broke the rules to help him.

## Briefing
Julian Ashby, an auditor in town for a client meeting, checked into room 614 of the Halden at 21:09. At 08:00 he missed a breakfast meeting with his colleague **Priya Nair**. At 08:35 housekeeping found his door ajar, his bed untouched, and his suitcase and phone still in the room. The night staff insist nobody could have left the hotel unseen. Find out **how Julian left the hotel** and **who helped him**.

## Cast
- **Julian Ashby** (`P_JULIAN`): guest in room 614, early 40s; missing. He gives no statement.
- **Priya Nair** (`P_PRIYA`): Julian's colleague; reported him missing. She stayed at another hotel.
- **Grace Okafor** (`P_GRACE`): night manager on the front desk, 22:00–06:00.
- **Theo Lindqvist** (`P_THEO`): night porter, 22:00–06:00. The porter desk is in the luggage room off the staff corridor, which no camera covers.

## Evidence
Initial evidence is **E01–E11**. **E12 and E13** stay hidden until A01. Each fact is a separate, selectable excerpt. The lines marked `F..` are the **exact text the player sees**. Testimony facts are phrased in the third person, as in Cases 001–002.

**E01 Priya Nair's statement, interviewed 08:50 (Testimony, initial).** “Julian and I were meeting at eight to rehearse a client presentation. He never came down. Last night at 23:41 he texted me: ‘Change of plan. I'm fine. Will explain.’ I'm staying across town; I wasn't at the Halden last night.”
- **F01A:** “Priya says Julian never came down for their 08:00 breakfast meeting.”
- **F01B:** “At 23:41 Julian texted Priya: ‘Change of plan. I'm fine. Will explain.’”

**E02 Grace Okafor's statement, interviewed 09:05 (Testimony, initial).** “I was on the front desk from ten until six. Mr Ashby never came down. A guest can only leave past my desk or through the fire exit, and that's alarmed.”
- **F02A:** “Grace says she was at the front desk from 22:00 to 06:00 and never saw Julian come down.”
- **F02B:** “Grace says the only ways out are past the front desk or through the alarmed fire exit.”

**E03 Theo Lindqvist's statement, interviewed 09:15 (Testimony, initial).** “Quiet night. No calls from the rooms after eleven. I sat at the porter desk in the luggage room the whole shift.”
- **F03A:** “Theo says he took no calls from guest rooms after 23:00.”
- **F03B:** “Theo says he never left the porter desk all night.”

**E04 Room 614 door-lock record (Digital, initial).** The lock records every key card that opens the door from the corridor. Leaving the room from inside is not recorded.
- **F04A:** “At 21:12 room 614 was opened with guest key card 1.”
- **F04B:** “At 23:48 room 614 was opened with staff master key MK-2.”
- **F04C:** “No card opened room 614 after 23:48. Leaving the room from inside is never recorded.”

**E05 Switchboard log (Digital, initial).**
- **F05A:** “At 23:40 room 614 received a three-minute outside call from a withheld number.”
- **F05B:** “At 23:44 room 614 called the porter desk; the call was answered and lasted one minute.”

**E06 Housekeeping report and photo, room 614 (Photograph, initial).** At 08:35 housekeeper Ines Duarte found the door held ajar by its swing bar. The photo shows the made bed with the turndown chocolate still on the pillow, a closed suitcase on the luggage rack, a phone on the desk, and an open wardrobe with empty hangers and no coat. The body text must describe every one of these details (photograph rule).
- **F06A:** “At 08:35 the door of room 614 was ajar, held open by its swing bar.”
- **F06B:** “The bed in room 614 had not been slept in.”
- **F06C:** “Julian's suitcase and phone were in the room; no overcoat or laptop bag was found.”

**E07 Floor plan and exit guide (Document, initial).**
- **F07A:** “Guest-room windows above the first floor are sealed and do not open.”
- **F07B:** “A staff-only service lift runs from every floor to the basement loading dock; it needs a staff key card.”
- **F07C:** “The fire stair has one way out: an alarmed door to the street. It has no door into the lobby.”

**E08 Lobby camera review (Digital, initial).** The hotel's security contractor reviewed all lobby footage for Julian.
- **F08A:** “At 21:09 Julian is seen entering a guest lift in the lobby.”
- **F08B:** “At 21:09 Julian is wearing a grey overcoat and carrying a laptop bag.”
- **F08C:** “Julian does not appear on the lobby or entrance cameras between 21:10 and 08:00.”
- **F08D:** “The hotel's cameras cover only the lobby, front desk, main entrance and guest lifts.”
- **F08E:** “The front desk is staffed on camera throughout the night.”

**E09 Fire-exit alarm record (Digital, initial).**
- **F09A:** “The fire-exit street door raised no alarm between 21:00 and 08:00.”
- **F09B:** “The fire-exit alarm passed its scheduled test at 06:00.”

**E10 Night-shift and master-key register (Document, initial).**
- **F10A:** “Master key MK-2 was signed out to night porter Theo Lindqvist at 22:00 and returned at 06:05.”
- **F10B:** “Master key MK-1 was signed out to night manager Grace Okafor; no other master keys were issued overnight.”
- **F10C:** “Theo Lindqvist was the only porter on the night shift.”

**E11 Compliments slip from the desk drawer (Document, initial; deliberate red herring).** A cream compliments slip printed “The Meridian Trust”, found in the desk drawer of room 614. Housekeeping can't say how long it had been there. No relationship, deduction or accepted proof set uses this item.
- **F11A:** “A blank compliments slip printed ‘The Meridian Trust’ was in the desk drawer of room 614; it bears no name, date or handwriting.”

**E12 Service-lift log (Digital, hidden; revealed by A01).** Held by the building's lift-maintenance contractor, not by the hotel.
- **F12A:** “At 23:49 master key MK-2 called the service lift to the sixth floor; it reached the basement loading dock at 23:51.”
- **F12B:** “No other service-lift trips were made between 23:00 and 05:30.”

**E13 Loading-dock camera stills (Photograph, hidden; revealed by A01).** The goods-in camera belongs to the building's delivery contractor and isn't part of the hotel's system, which is why the hotel's review (E08) never covered it.
- **F13A:** “At 23:51 two people step out of the service lift at the loading dock: one in a hotel porter's uniform, one in a grey overcoat carrying a laptop bag.”
- **F13B:** “At 23:58 the person in the grey overcoat walks alone up the rear lane and gets into a waiting taxi.”
- **F13C:** “Neither face is visible in the stills.”

**Visibility rules:** E12 and E13 have `initial: false`. A01 reveals both as **New**, never as **Inspected**. E11 is irrelevant and must never unlock a deduction.

## Timeline
| Time | Event |
|---|---|
| 21:09 | Julian enters a guest lift in the lobby, in a grey overcoat with a laptop bag (E08) |
| 21:12 | Guest key card 1 opens room 614 (E04) |
| 22:00 | Night shift starts. MK-2 is signed out to Theo, MK-1 to Grace (E10) |
| 23:40 | Three-minute withheld-number call to room 614 (E05) |
| 23:41 | Julian texts Priya “Change of plan. I'm fine. Will explain.” (E01) |
| 23:44 | Room 614 calls the porter desk; the call is answered (E05) |
| 23:48 | MK-2 opens room 614 (E04) |
| 23:49–23:51 | MK-2 takes the service lift from the sixth floor to the loading dock (E12, hidden) |
| 23:51 | Porter's uniform and grey overcoat step out at the loading dock (E13, hidden) |
| 23:58 | The overcoat leaves alone in a taxi from the rear lane (E13, hidden) |
| 06:00 / 06:05 | Fire-exit alarm test passes (E09); MK-2 is returned (E10) |
| 08:00 | Julian misses breakfast (E01) |
| 08:35 | Housekeeping finds the door propped by the swing bar and the bed untouched (E06) |
| 08:50–09:15 | Statements from Priya, Grace and Theo |
| ~09:40 | After A01, the contractor's lift log and dock stills arrive |

## Investigation and deduction graph
**Mandatory path.** All three relationship types are used; fact pairs are order-insensitive.
1. **R01** `same_event`: **F08A** (lift at 21:09) × **F04A** (guest key opens 614 at 21:12) → **D01** “Julian went up to room 614.” Requires R01.
2. **R02** `supports`: **F08C** (never on the lobby cameras again) × **F09A** (fire exit never alarmed) → **D02** “Julian didn't leave through the lobby or the fire exit.” Requires R02 and D01. F09B (the alarm tested as working) and F07C (the stair has no lobby door) back this up in the text.
3. **R03** `contradicts`: **F02B** (Grace says there are only two ways out) × **F07B** (the service lift runs to the loading dock) → **D03** “There is a third way down: the service lift bypasses the lobby.” Requires R03.
4. **R04** `contradicts`: **F03A** (Theo took no calls after 23:00) × **F05B** (room 614 called the porter desk at 23:44 and it was answered) → **D04** “Someone at the porter desk took a call from room 614, though Theo says he took none.” Requires R04.
5. **R05** `supports`: **F04B** (MK-2 opens 614 at 23:48) × **F10A** (MK-2 signed out to Theo) → **D05** “The master key signed out to Theo opened room 614 four minutes after that call.” Requires R05. The description must say that a key record shows which key was used, not whose hand held it.
6. **A01: Request the service-lift log and the loading-dock camera** requires **D02 + D03 + D04 + D05**. Player-visible justification: “Julian didn't leave through the lobby or the fire exit, but the staff service lift bypasses both. Minutes after room 614 called the porter desk, the master key signed out to Theo opened the room. The lift and the loading-dock camera belong to the building's contractors, so ask them for their records.” A01 reveals **E12 + E13** as **New**.
7. **R06** `same_event`: **F12A** (MK-2 takes the lift from floor 6 to the dock, arriving 23:51) × **F13A** (two people step out of the service lift at 23:51) → **D06** “Two people rode the service lift down from the sixth floor at 23:51.” Requires R06 and A01.
8. **R07** `supports`: **F08B** (grey overcoat and laptop bag at 21:09) × **F13B** (the grey overcoat leaves alone by taxi at 23:58) → **D07** “Julian left in a taxi, alone and of his own accord.” Requires R07 and D06.

**Mandatory deductions:** D01–D07. **Pre-action:** R01–R05. The player narrows the exit **and** the helper before A01. The hidden evidence confirms the route and the departure but shows no faces.

**Optional relationships and deductions:**
- **R08** `supports`: F06C (no coat or laptop bag in the room) × F08B (coat and bag at 21:09) → **D08** “Julian took his coat and laptop bag, but left his suitcase and phone.”
- **R09** `supports`: F05A (23:40 withheld-number call) × F01B (23:41 text) → **D09** “Julian's plans changed straight after a call from a withheld number.”
- **R10** `contradicts`: F03B (Theo never left the porter desk) × F12A (MK-2 in the service lift at 23:49) → **D10** “Theo's key was in the service lift, not at the porter desk.” This is post-action.
- No relationship uses E11. Wrong comparisons receive neutral feedback.

**Reachability:** inspect E02–E05 and E07–E10; link R01–R05; perform A01; inspect E12 and E13; link R06 and R07; submit. There are no prerequisite cycles, and no hidden fact is needed before the action.

**Hints, in order:**
| Relationship | Nudge |
|---|---|
| R01 | “The cameras saw Julian go up. Does anything record him reaching his room?” |
| R02 | “If Julian walked out, which records would have noticed?” |
| R03 | “Grace lists two ways out. Does the floor plan agree?” |
| R04 | “Theo says the phones were quiet. What does the switchboard say?” |
| R05 | “A staff key opened 614 just before midnight. Whose key was it that night?” |
| R06 | “The lift log and the dock camera both mention 23:51.” |
| R07 | “Who left in the taxi? Compare what they wore with what Julian wore that evening.” |

## Final report
**Two conclusions** (one choice each; the proof selection is shared and validated by the engine). The report UI offers evidence only, so every accepted proof set uses evidence IDs.

| ID | Player-facing question | Choices (IDs) | Correct | Required deductions | Accepted proof sets | Supporting proof IDs |
|---|---|---|---|---|---|---|
| **C01** | “How did Julian leave the hotel?” | `service_lift` By the service lift to the loading dock; `lobby` Through the lobby; `fire_exit` Down the fire stair and out of the fire exit; `still_inside` He never left the hotel | `service_lift` | D02, D03, D06, D07 | `[E08, E09, E13]` | E01, E04, E06, E07, E12 |
| **C02** | “Who most likely helped Julian leave unseen?” | `priya` Priya Nair; `grace` Grace Okafor; `theo` Theo Lindqvist; `guest` Another guest | `theo` | D04, D05, D06 | `[E10, E12, E13]` or `[E04, E10, E13]` | E02, E03, E05 |

**Proof semantics:** the selection must contain a full set for **each** conclusion; extra items are allowed only if they appear in an accepted or supporting set. **E12 + E13 alone never prove C02.** Without E10 the key and the uniform belong to no one. E11 is excluded, so selecting everything fails.

## Alternatives that player-visible evidence addresses
- **He walked out through the lobby while the desk was busy:** the cameras cover the lobby and entrance all night and never show him (F08C, F08D). The desk is staffed on camera throughout (F08E).
- **The fire stair:** the only exit is the alarmed street door, which raised no alarm and passed its 06:00 test (F07C, F09A, F09B).
- **The window:** sealed above the first floor (F07A).
- **He is still in the hotel:** the overcoat leaves by taxi at 23:58 (F13B), and his coat and laptop bag are gone from the room (F06C).
- **He was taken against his will:** he texted “I'm fine” (F01B), took his own coat and bag (F06C), and walked alone to the taxi (F13B).
- **Grace helped:** MK-1 never opened 614 (F04B names MK-2), and she is on camera at the desk all night (F08E).
- **Priya helped:** the service lift needs a staff key card (F07B), and only MK-2 was used (F12A, F12B).
- **Another guest or an intruder:** same as above, plus the second person at the dock wears a porter's uniform (F13A).
- **Someone else used Theo's key:** Theo was the only porter on shift (F10C), the key was signed out to him all night (F10A), the porter desk answered the 23:44 call (F05B), and the person at the dock wears a porter's uniform (F13A). Together these support “most likely”. A borrowed key or uniform can't be excluded absolutely, which is why the question asks “most likely”.
- **The Meridian Trust slip explains everything:** it has no name, date or handwriting, and nothing ties it to the night (F11A). It is a red herring for this case.

## Narrative solution (resolution text)
Julian rode up to room 614 at 21:09 and never came back through the lobby. At 23:40 an outside caller who withheld their number spoke to him for three minutes. A minute later he texted Priya that his plans had changed. At 23:44 he rang the porter desk. Theo answered, came up with master key MK-2, and took Julian down the staff service lift to the loading dock, where nobody from the hotel was watching. Julian walked up the rear lane to a waiting taxi at 23:58. Theo flipped the swing bar so he could come back for the suitcase after his shift, but the morning staff arrived first. He denied everything because taking cash to sneak a guest out by the service lift would cost him his job.

**After the report only:** Julian calls Priya at 10:20 from a train. He's safe. He says the caller told him the morning meeting wasn't what it seemed and that he should leave quietly, tonight, without his phone. He won't say more by phone. Who called, and whether the compliments slip in his drawer has anything to do with it, stays open. This is the first thread of the Meridian Trust storyline and is not part of the evidence.

### Residual uncertainty
The faces in the dock stills aren't visible. The helper's identity rests on the key, the shift register, the answered call and the uniform **together**, never on one record alone. The caller's identity and motive are deliberately left unresolved.

## Secondary narrative
The first Meridian Trust appearance is E11 (the slip) plus the unexplained call in the resolution. Neither gates anything. Keep the slip's emblem identical in later cases (see the art brief). Start a story bible entry: *The Meridian Trust: unknown organisation; first seen as a blank compliments slip in room 614 of the Halden, 26–27 Oct 2026; possibly linked to a withheld-number call that warned an auditor away from a client meeting.*

## Case art
The full prompts for the image assistant are in [ART-PROMPTS.md § Case 003](ART-PROMPTS.md#case-003--the-empty-room), with every asset marked **TODO**. There are 11 assets: a briefing header, four cast portraits and six evidence photos. Location art is skipped because the app doesn't display it. The digital logs (E04, E05, E09, E12) use the app's icon fallback, which avoids image text that has to be exact. The library card `case-03-card` is already done and sets the hotel's look: dark wood doors, brass wall sconces, patterned charcoal carpet, and brass electronic card locks with lever handles.

## Case QA checklist
- [x] Stable fact IDs and exact player-visible English excerpts (E01–E13; E12 and E13 hidden).
- [x] All three relationship types on the mandatory path, with explicit pairs and prerequisites.
- [x] One justified action that reveals two items, neither auto-inspected.
- [x] Two conclusions with accepted proof sets and supporting IDs; the hidden evidence alone can't prove who.
- [x] Lobby, fire exit, window, still inside, abduction, every other helper and a borrowed key are all addressed in player-visible evidence.
- [x] Red herring (E11) excluded from all proof.
- [x] Graph drafted as engine JSON; passes validation, the full-path solver, wrong-answer and select-everything checks.
- [ ] Generate and accept the art (ART-PROMPTS.md § Case 003).
- [ ] Author `content/cases/case-003/` (case.json, en.json, sk.json), wire the art, add `case-003.test.ts`.
- [ ] Blind-review R02 (two absences “supporting” each other) and C02's combined-evidence identification.
- [ ] Cold-playtest with 5–10 unfamiliar players; tune for 9–12 minutes.
