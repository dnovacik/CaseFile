# Art prompts — image generation brief

This file is written to be read directly by an image-generating assistant (e.g. ChatGPT). A human only needs to paste:

> Read https://raw.githubusercontent.com/dnovacik/CaseFile/master/docs/ART-PROMPTS.md and follow its instructions. Start with the first asset marked TODO.

To request specific assets, add for example: `Generate C01-E07 and C01-LOC-OFFICE only.`

---

## Instructions for the image assistant

You are producing art assets for **Casefile: Five Minutes**, a neo-noir mobile detective game. Follow these rules exactly.

### Workflow
1. **One image per response.** Never combine several assets into one image, a grid, a collage or a contact sheet. Never generate two assets in one turn.
2. Before each image, write one line: `Asset <ID> → <filename>`.
3. Generate the image at the exact size listed for that asset.
4. After the image, write a short self-check against the asset's **Must** and **Must not** lists (one line per item, ✅/❌). If any item fails, say so and offer to regenerate.
5. Then **stop and wait.** Continue only when the user replies:
   - `next` → generate the next asset in this file's order that is marked **TODO** (or the next one from the user's requested list).
   - `redo <ID> <feedback>` → regenerate that asset with the feedback applied.
   - `skip` → move on without regenerating.
6. Work through assets in the order they appear in this file. Skip assets marked **DONE** unless the user explicitly asks for them by ID.
7. When the user attaches a reference image, match it exactly where the prompt says "match the reference".

### Global style (applies to every asset unless the asset says otherwise)
- Modern neo-noir, cinematic **photograph** look, realistic. Not illustrated, not cartoon, not 3D-render glossy.
- Low-key lighting: warm tungsten/brass highlights (`#C9A46B`) against deep blue-black shadows (`#101318`). Occasional muted crimson (`#A63838`) only where it occurs naturally. No other strong hues (no green, purple, neon).
- Shallow depth of field, subtle film grain, restrained contrast, no lens flare.
- Contemporary setting (2020s). No 1940s pastiche: no fedoras or trench coats **on people**.
- **No text, letters, numbers, logos or watermarks** anywhere, unless the asset's prompt explicitly allows specific text. Allowed text must be spelled exactly as given.
- Leave darker negative space where the prompt says app text will overlay.

### Fairness rules (this is a fair-play mystery game — art is evidence)
Players inspect every image for clues. An image must never contradict or add to the case facts.
- Do not add extra entry routes (open windows, vents, side doors, open doorways) to locked rooms.
- Do not add CCTV views, screens or documents that would show information the case doesn't contain.
- Recurring objects (the watch, the key cabinet, the seal tag, people's clothing) must look the same in every image they appear in.
- Readable text, numbers or names must match the facts exactly, or be absent.
- People in evidence photos must not be identifiable unless the prompt says so.

### Sizes
| Code | Size | Use |
|---|---|---|
| `L` | 1536×1024 landscape | cards, headers, locations, most evidence |
| `P` | 1024×1536 portrait | phone-photo evidence |
| `S` | 1024×1024 square | icons, portraits |

Deliver PNG. The user will save each image under the given filename.

---

## Asset list

| ID | File | Size | Status |
|---|---|---|---|
| APP-HEADER | `app-library-header.png` | L | DONE |
| APP-ICON | `app-icon.png` | S | DONE |
| APP-SPLASH | `app-splash.png` | S | DONE |
| CARD-01 … CARD-09 | `case-NN-card.png` | L | DONE |
| CARD-10 | `case-10-card.png` | L | TODO (optional palette fix) |
| C01-BRIEFING | `case-01-briefing.png` | L | DONE |
| C01-LOC-EXTERIOR | `case-01-loc-exterior.png` | L | DONE |
| C01-LOC-OFFICE | `case-01-loc-office.png` | L | DONE |
| C01-LOC-PRINT | `case-01-loc-print-room.png` | L | DONE |
| C01-LOC-SECURITY | `case-01-loc-security-desk.png` | L | DONE |
| C01-CAST-ADRIAN / MARCUS / ELENA / THOMAS | `case-01-cast-<name>.png` | S | DONE |
| C01-E07 | `case-01-e07.png` | P | DONE |
| C01-E08 | `case-01-e08.png` | L | DONE |
| C01-E09 | `case-01-e09.png` | L | DONE |
| UI-EVIDENCE … UI-REPORT | `ui-<screen>.png` | P | TODO |

---

## App shell

### APP-HEADER — Library header · L · DONE
A detective's desk at night seen from a low angle: a dark felt hat resting on stacked case folders, a brass desk lamp casting warm light, scattered photographs and a closed notebook, bookshelves fading into darkness behind.
- **Must:** top-centre third and bottom quarter dark and calm (a large title and tagline overlay there).
- **Must not:** people, text.

### APP-ICON — App icon · S · DONE
A single minimal symbol: a closed manila case folder with a brass strap clasp, lit from the upper left, on a near-black `#101318` background.
- **Must:** bold silhouette readable at 48 px; fills ~80% of the canvas.
- **Must not:** text, border, rounded corners (the OS adds them).

### APP-SPLASH — Splash icon · S · DONE
The same brass-clasped folder as APP-ICON, alone, centred, on a **fully transparent** background.
- **Must:** true alpha transparency; identical folder design to APP-ICON.

---

## Case library cards

Template for every card — **L**:
> Case card art. Main subject on the **right half** only; the **left half fades into deep shadow** because a case number, title and details overlay it. Subject: `<SUBJECT>`

- **Must:** subject fully inside the right half and vertically centred (the card is cropped to ~2.3:1 from the centre).
- **Must not:** people's faces, text.

| ID | Status | Subject |
|---|---|---|
| CARD-01 | DONE | an engraved steel-silver wristwatch with a black dial lying in a half-open wooden desk drawer in a private gallery office, a single lamp glinting off the case |
| CARD-02 | DONE | a dented, taped cardboard parcel on an apartment-building doormat in a dim hallway, a delivery slip tucked under it |
| CARD-03 | DONE | a hotel room door slightly ajar at the end of a corridor, warm light spilling from inside, the bed untouched |
| CARD-04 | DONE | an empty open-plan office at night, one monitor glowing, a wall clock in soft focus, rain on the windows |
| CARD-05 | DONE | a fountain pen resting on a contract page under a desk lamp, a second signature page beside it, faint ink smear |
| CARD-06 | DONE | a museum gallery at night, a dark empty display plinth under a spotlight behind a rope barrier, a small alarm panel on the wall |
| CARD-07 | DONE | a printed photograph lying on a dark table, a magnifying loupe on top, more prints scattered behind |
| CARD-08 | DONE | a vintage studio microphone and headphones on a radio desk, an unlit "ON AIR" sign (allowed text: `ON AIR`), dust in the lamp light |
| CARD-09 | DONE | an empty night-train compartment, one seat with a forgotten wool scarf, the window reflecting the corridor |
| CARD-10 | TODO | an open ledger book and a stack of receipts under a banker's lamp with an **amber/brass glass shade (not green)**, a calculator tape curling off the desk |

---

## Case 001 — The Missing Watch

**Case facts the art must respect** (designer spoilers): Blackwood Gallery, an upscale contemporary art gallery, evening of a private exhibition, 17 October 2026. Owner Adrian Vale's engraved watch vanishes from an unlocked desk drawer in his private office, which has a self-locking door with a badge reader. No forced entry. The office windows are fixed panes that do not open. The emergency office key sits in a sealed key cabinet at the security desk. CCTV covers only the public galleries and the main stairwell — the staff wing (back corridor, print room, storage, private office) has no cameras.

**Recurring objects — keep identical everywhere:**
- **The watch:** steel-silver case and bracelet, black dial with baton markers, small date window at 3 o'clock, ornately engraved bezel.
- **The key cabinet:** dark grey steel wall cabinet with a glass window, red label reading `EMERGENCY KEYS` / `AUTHORISED PERSONNEL ONLY`, eight numbered hooks (1–8) each holding a key, a white plastic pull-tight seal looped through the handle with a tag reading `007342` and a barcode, a small badge reader with a green light beside it.
- **Marcus's jacket:** dark navy suit jacket with a zipped inner pocket; his staff badge clips to the outside of the jacket.

### C01-BRIEFING — Briefing header · L · DONE
Close-up of an **empty** wooden desk drawer, slightly open, in a private office of an upscale art gallery at night. A faint impression in the drawer's dark felt lining where a wristwatch used to lie. Brass lamp light from the left.
- **Must:** bottom third dark (case title overlays it); drawer clearly empty.
- **Must not:** the watch itself, people, text.

### C01-LOC-EXTERIOR — Blackwood Gallery exterior · L · DONE
A refined contemporary gallery on a wet city street at night, warm light through tall windows, guests at a private exhibition visible inside — several men in dark suits.
- **Allowed text:** `BLACKWOOD` / `GALLERY` on the façade sign.
- **Must:** lower half dark for text.

### C01-LOC-OFFICE — Owner's private office · L · DONE
A heavy walnut desk with a top drawer, framed artworks on the walls, a closed office door on the right with a small badge-reader panel beside it showing a dim status light. A tall window behind the desk shows city lights; it is visibly a **fixed, non-opening pane**. Night, lamp-lit, nobody present.
- **Must not:** open windows, a second door, vents, people.

### C01-LOC-PRINT — Gallery print room · L · DONE
A large office printer/copier mid-job with paper in the output tray, shelves of exhibition catalogues, a desk with a computer workstation, nobody present. Cool fluorescent light mixed with a warm desk lamp. A doorway may open onto a storage room with shelving.
- **Allowed text:** `BLACKWOOD GALLERY` on a poster.
- **Must not:** people, readable screen content.

### C01-LOC-SECURITY — Security desk · L · DONE
A small security station: a handheld radio in its charger, a desk lamp, a clipboard, and **the key cabinet** (see recurring objects) on the wall. CCTV monitors showing **only public exhibition rooms** — paintings, sculptures, the main stairwell.
- **Must:** cabinet matches C01-E08 exactly (attach it as a reference if regenerating).
- **Must not:** CCTV views of back corridors, storage or offices; open doorways; people.

### Cast portraits — S · DONE
Template:
> Character portrait, head-and-shoulders, neutral expression, looking slightly off-camera to the right, dark background, identical lighting setup for every portrait in this set: `<DESCRIPTION>`

- **Must:** same lighting, background and framing for all four.
- **Allowed text:** `BLACKWOOD GALLERY` on staff lanyards/badges (spelled exactly); `SECURITY` on Thomas's patch.

| ID | Description |
|---|---|
| C01-CAST-ADRIAN | gallery owner, early 60s, swept silver hair, grey stubble, black suit with an open-collar white shirt and a pocket square, composed but irritated |
| C01-CAST-MARCUS | gallery manager, late 30s, short dark hair, light stubble, dark navy suit over a white shirt, staff lanyard and a staff badge clipped to the jacket, calm and polite — **not** shifty-looking |
| C01-CAST-ELENA | curator, early 40s, dark hair in a loose bun, tortoiseshell glasses pushed up, a pencil tucked in her hair, cream blouse, charcoal cardigan, staff lanyard, attentive |
| C01-CAST-THOMAS | security officer, 50s, broad-shouldered, short greying hair and beard, black security jacket with a radio speaker-mic and a coiled earpiece, steady and tired |

### C01-E07 — Corridor photograph · P · DONE
A guest's smartphone photo of the gallery's **staff back corridor** at night: concrete floor, wrapped artworks leaning against the wall, a utility trolley, a door at the far end. A person in a dark suit walks **away** from the camera, seen from behind and backlit.
- **Must:** slight motion blur and imperfect framing (a real phone photo); the figure could plausibly be Adrian or Marcus.
- **Must not:** visible face, readable hair colour, glasses, badge or any distinguishing mark; a timestamp overlay (the app adds it).

### C01-E08 — Emergency key cabinet · L · DONE
Forensic documentation photo of **the key cabinet** (see recurring objects) mounted on a wall beside a door, with a framed evacuation floor plan partly visible. Flat, even, clinical lighting — this is an evidence photo, so the noir grade is relaxed.
- **Allowed text:** `EMERGENCY KEYS`, `AUTHORISED PERSONNEL ONLY`, hook numbers `1`–`8`, seal tag `007342`, `BLACKWOOD GALLERY` and `YOU ARE HERE` on the floor plan.
- **Must:** seal intact and looped through the handle; all eight keys present.

### C01-E09 — Watch recovery · L · DONE
Forensic evidence photo: **the watch** (see recurring objects) partly visible inside the opened zipped inner pocket of **Marcus's navy jacket**, laid flat on a steel table. A blue-gloved hand holds the zip open; a black-and-white forensic scale ruler lies beside it. Even, clinical lighting with a slight warm cast.
- **Must:** watch matches CARD-01; jacket matches Marcus's portrait.

---

## UI mockups (optional design exploration) — P · TODO

These are layout explorations, not production art. One screen per image.

Common brief for every screen:
> Mobile UI mockup, iPhone portrait, matching the Casefile library and briefing style: dark `#101318` background, `#1B222B` cards, brass `#C9A46B` accents, ivory `#E8E2D8` text, serif titles, sans-serif body. Minimum 44 pt tap targets, body text at least 15 pt, never use colour as the only status cue. Bottom tabs: only **Cases** and **Settings**. No profile/account UI. Screen: `<SCREEN>`

- **Allowed text:** the UI copy given for the screen, spelled exactly.

| ID | Screen |
|---|---|
| UI-EVIDENCE | Evidence workspace for Case 001 "The Missing Watch": filter row (All / Testimony / Documents / Digital / Photos / Physical) and evidence cards — E01 Adrian's statement, E02 Marcus's statement, E03 Elena's statement, E04 Thomas's statement, E05 Office access log, E06 Print server report, E07 Corridor photograph, E08 Security desk record. Each card shows an "Inspected" or "New" state with icon + label. A floating button opens the Deduction Board. |
| UI-DETAIL | Evidence detail: E02 Marcus's statement as an interview transcript — "I was in the print room the whole time, from about 20:45 until 21:15. My access badge stayed clipped to my jacket." Below, extractable facts as selectable chips and a "Compare facts" button. |
| UI-COMPARE | Compare bottom sheet: two fact cards — Fact A "Marcus says his badge M-04 stayed on him and he never went near the office." Fact B "Badge M-04 unlocked Adrian's office at 20:48." Three large choices: Supports / Contradicts / Same event, and an "Analyze" button. |
| UI-BOARD | Deduction board: vertical chain of confirmed discoveries (D01 "Marcus's badge account is questionable", D02 "The print job is not an alibi"), one locked open question, and an available follow-up action card "Request consented search of Marcus's belongings" with a one-line justification. |
| UI-REPORT | Final report: three steps — Suspect (Adrian, Marcus, Elena, Thomas as portrait chips), Entry method (Badge M-04, Emergency key, Door left open, Forced entry), Supporting evidence (multi-select evidence cards) — and a "Submit report" button. |

---

## Adding a new case

When a new case is authored, add a section in the same shape:
1. A **case facts** paragraph listing everything the art must respect (locked rooms, entry routes, cameras, times).
2. A **recurring objects** list with exact descriptions.
3. Briefing header, locations, cast portraits and evidence photos, each with ID, filename, size, status, prompt, **Must** / **Must not** and any **Allowed text**.
4. New rows in the asset list table.
