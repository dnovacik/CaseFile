# Live case packs: design

**Status:** proposed, 31 Oct 2026. Not yet planned or built.
**Why:** new cases should reach players **without a Google Play / App Store release**. A store build should only be needed for new mechanics or screens. The model is Outbreak's live content packs (`D:/_personal/Outbreak`, `docs/superpowers/specs/2026-10-27-live-content-design.md`), adapted to Casefile.

## Decisions made by the author
- **Hosting:** the same cognision VPS as Outbreak, with a **small API** of its own (not static-only). It serves the manifest and the server's clock; nginx serves the pack files.
- **Case 003 stays bundled** and ships in the store build that brings this system. **Case 004 is the first live pack.**

## Goals
- A new case is a case definition, its strings in every locale and its art. It arrives from the server and appears in the library without an app update.
- Text and art of a shipped case (bundled or live) can be corrected live.
- Offline-first stays true: the bundled cases and every installed pack work with no connection. Nothing ever waits on the network.
- Optional **release date** per pack (`startsAt`, server time), so cases can be dropped on a schedule.

## Non-goals
- No new **code** over the air: no new mechanics, screens, evidence types or engine rules. No `expo-updates`.
- No admin panel; publishing is the same Git + script flow as Outbreak.
- No accounts, per-player targeting or analytics.
- Billing isn't built here. Packs only carry the field it will need.

## Anti-goals (a failure even if it "works")
- A save is lost or a case breaks because content changed under the player.
- A case appears with missing art or untranslated text.
- A half-downloaded, tampered or **invalid** case becomes playable.
- A player in the middle of a case has its content swapped under them.
- Changing the phone's clock opens a case before its release date.

## How it works

### Pack format (in the repo)
```
content/packs/<case-id>/      e.g. content/packs/case-004/
  pack.json      { id, version, minAppVersion, caseNumber, access, startsAt? }
  case.json      the CaseDefinition (same schema as content/cases/*)
  en.json, sk.json   strings for every supported locale
  media/*.webp   art, named by asset ID (case-04-briefing.webp, …)
  publish.json   optional { "audience": "playtest" }
```
- `id` matches the folder and the definition's `id` (`case_004` ↔ `case-004`). `version` is a whole number raised on every publish. A published version never changes.
- `caseNumber` sets the library order and replaces that number's "coming soon" card.
- `access`: `"free"` or `"premium"`. Recorded now, **not enforced** until billing exists (every case stays playable until then).
- The content tests (`content/__tests__/all-cases.test.ts`, the fair-play suite) run over **bundled cases plus every pack**, so a pack PR is checked exactly like Case 002 and 003.

### Server (`apps/server`, new)
- A small Node service on the VPS: `GET /v1/health`, and `GET /v1/content/manifest` → `{ serverTime, packs: [{ id, version, minAppVersion, caseNumber, access, audience, startsAt?, files: [{ path, size, sha256, md5 }] }] }` with `Cache-Control: no-store`. It reads `manifest.json` from the content folder, as Outbreak's controller does.
- nginx serves `/content/<id>/<version>/<file>` as immutable static files on the same host.
- Deployment mirrors Outbreak's `deploy-server.sh`: build locally, upload, a systemd service, previous release kept for rollback.

### Publishing
1. GPT (or Claude) authors a pack in a PR under `content/packs/`. The art follows `docs/ART-PROMPTS.md` as today.
2. Claude reviews and runs the checks: the validator, the solver, the fair-play suite and the case's own tests.
3. The author merges, then runs `scripts/publish-content.sh`. It runs the checks, builds `dist/content/` with sizes and hashes, refuses to change an already-published version, uploads the files, verifies them on the server, and **replaces the manifest last** so phones never see a pack whose files aren't there yet.
4. To try a pack on test builds first, add `publish.json` with `{ "audience": "playtest" }`; remove it and raise `version` to release to everyone.

### App
- **Download (background):** at launch and on every return to the foreground, fetch the manifest. Download new or changed packs into app storage at `content/<id>/<version>/`, and check every file's size and hash. A pack version counts as installed only when `index.json` names it, and `index.json` is written atomically after all its files check out. Failures retry on the next check. As in Outbreak: `expo-file-system` and `@noble/hashes`.
- **Validate before use (new compared with Outbreak):** before activating, the app parses the pack's definition with the engine's `checkCase`, against **each locale's strings** and the set of art files actually present. A pack with any error stays inactive and the previous version stays in use.
- **Activation:** packs switch on at launch, and when the app returns to the foreground **only if no case screen is open**. Otherwise they wait for the next calm moment. A case's content never changes while the player is inside it.
- **Gates:** packs whose `minAppVersion` is newer than the app are ignored. Packs before `startsAt` (by server time; the offset from the manifest is remembered offline) are hidden. If server time has never been seen, scheduled packs stay hidden. `playtest` packs only reach builds made with a playtest flag.
- **Registry:** `content/index.ts`'s fixed `cases` array becomes a store: bundled cases plus active packs, ordered by case number. Screens read cases through it instead of importing the array.
- **Art:** `artFor(assetId)` looks in the bundled `caseArt` first, then the active packs' media (`{ uri }` from app storage). A missing asset falls back as today.
- **Saves:** hydration already leaves saves of unknown cases untouched. When a pack activates, its saved progress is hydrated then. A pack that changes a case's **`contentVersion`** archives old progress for that case, exactly as a bundled update does today.

### Rules for pack authors
- **IDs are permanent:** never rename a case, evidence, fact, relationship, deduction, action or conclusion ID once published.
- **Text and art fixes** keep `contentVersion` and must leave the definition unchanged, so saves carry over. A **structural change** raises `contentVersion` and resets players' progress in that case (archived, not deleted). Prefer text fixes.
- A pack may override a **bundled** case (same `id`) for text and art fixes only; the publish checks enforce an identical definition.
- Every case must pass the same fair-play suite as bundled cases, in every locale, with every referenced asset present.
- A pack ships every locale the app supports at its `minAppVersion`. If a later app adds a language that an older pack lacks, that case shows in English (the existing fallback) until the pack is republished with the new strings.

## Milestones
1. **L1, app (one store release, together with Case 003):** case registry, pack-media art lookup, pack store with hashing, validation and atomic activation, server-time offset, persistence hydrating late cases. No visible change while there are no packs.
2. **L2, server and publishing:** `apps/server`, nginx config, `deploy-server.sh`, `build-content.mjs` and `publish-content.sh`; the content tests extended over `content/packs/`.
3. **L3, first live pack:** Case 004 ("21:37"), authored and illustrated as Cases 002–003 were, published without a store release.

## Calls made in the design (check these)
- **Server stack:** a minimal Node HTTP service (Fastify) rather than NestJS. There's no database or jobs, so NestJS's weight buys nothing. The deployment shape (systemd, `/opt/casefile-server`, rollback copy) copies Outbreak's.
- **Host name:** `casefile-api.cognision.eu`, matching `outbreak-api.cognision.eu`. It needs a DNS record and a certificate, and the server listens on a port other than Outbreak's 3000 (3001).
- **Release dates without end dates:** cases don't expire, so packs get `startsAt` only; there is no `endsAt`.
- **Playtest audience:** kept from Outbreak, via a build-time flag (`EXPO_PUBLIC_PLAYTEST`), so a pack can be checked on a test build before release.
- **Override of bundled cases:** allowed for text and art only, as above.
- **Activation timing:** "no case screen open" rather than Outbreak's encounter-specific checks.

## Left to the builder
- Exact manifest and `pack.json` shapes beyond the fields above; shared zod schemas in the engine or a small contracts module.
- Whether pack definitions are also signed (e.g. Ed25519) on top of HTTPS and hashes.
- Storage cleanup of replaced versions (Outbreak's `sweepUnused` pattern).
- How the library shows a pack that is installed but blocked by `minAppVersion` (default: not shown).
