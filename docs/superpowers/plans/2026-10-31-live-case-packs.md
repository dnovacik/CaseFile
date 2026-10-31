# Live Case Packs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** New cases (definition, strings, art) reach players from the cognision VPS without a store release, verified and validated on the phone before they become playable.

**Architecture:** Pure pack logic (schemas, sync planning, merging packs with bundled cases, validation) lives in `@casefile/content/packs` so the app, the server and the scripts share it and Node tests cover it. The app keeps thin I/O (`expo-file-system`) and a case registry that screens read instead of the fixed `cases` array. A small Fastify service serves the manifest and server time; nginx serves immutable pack files; `scripts/publish-content.sh` publishes.

**Tech Stack:** TypeScript, zod (via `@casefile/engine`), Expo SDK 58 (`expo-file-system`, `expo-constants`, expo-router), zustand, Fastify + tsup (server), Vitest, bash + ssh (publishing).

**Spec:** `docs/superpowers/specs/2026-10-31-live-cases-design.md`. Reference implementation: `D:/_personal/Outbreak` (`apps/mobile/src/content/packStore.ts`, `active.ts`, `scripts/build-content.mjs`, `scripts/publish-content.sh`, `apps/server/src/content.controller.ts`).

## Global Constraints
- No code over the air; packs carry `case.json`, `<locale>.json` and `media/*.webp` only. No `expo-updates`.
- Pack folder `content/packs/<id>/`; `id` matches `/^case-\d{3}$/` and the definition id with `-`→`_` (`case-004` ↔ `case_004`).
- `pack.json`: `{ id, version (int ≥ 1), minAppVersion (semver), caseNumber (int ≥ 1), access: "free" | "premium", startsAt? (ISO UTC) }`. `publish.json` optional: `{ "audience": "playtest" }`, default `"all"`.
- A published `(id, version)` never changes; the build refuses different files for a published version.
- Manifest: `GET /v1/content/manifest` → `{ serverTime, packs: [{ id, version, minAppVersion, caseNumber, access, audience, startsAt?, files: [{ path, size, sha256, md5 }] }] }`, `Cache-Control: no-store`. Files at `/content/<id>/<version>/<path>`, immutable.
- Host `https://casefile-api.cognision.eu`; server port `3001`; app overrides with `EXPO_PUBLIC_API_URL`; playtest builds set `EXPO_PUBLIC_PLAYTEST=1`.
- A pack activates only when every file matched size + MD5, `checkCase` passes for `en` and every other locale it ships, all referenced asset IDs exist (bundled art ∪ its media), its `minAppVersion` ≤ app version, and (if `startsAt`) server time has passed it. If server time has never been seen, scheduled packs stay hidden. Dev builds (`__DEV__`) ignore `startsAt`.
- A pack overriding a bundled case must have a definition identical to the bundled one (text/art fixes only).
- Content never changes while a route under `/case/` is open.
- Packs absent from a later manifest stay installed (saves may refer to them).
- `access` is recorded, not enforced.
- Bundled cases keep library numbers 1…N in array order; `upcomingCases` entries whose number is taken by a case are hidden.

## Review Focus
1. **App killed mid-download or mid-index-write**: the next launch must read the last complete index (falling back to `index.json.tmp`), never a partial pack. Test: `chooseIndex` in Task 1.
2. **Unreachable, slow or malformed manifest**: play continues with installed content, nothing throws. Test: `parseManifest` returns `null` on garbage (Task 1); `syncPacks` never throws (Task 7, manual).
3. **A downloaded pack that fails validation** (missing string, missing art, id mismatch, changed bundled definition): stays inactive, the previous installed version stays in use, the error is logged. Test: `mergeCases` falls back to the previous version (Task 1).
4. **Phone clock moved forward**: a case with `startsAt` must not appear early. Test: `isReleased` uses the server offset and hides when the offset is unknown (Task 1).
5. **A pack raising `contentVersion` for a case with saved progress**: progress is archived, never silently dropped or loaded against the wrong definition. Test: `staleCaseIds` (Task 6).
6. **Two sources claiming one case number** (a pack vs a bundled case, or two packs): the later one is rejected with an error, and the library never shows two cards with one number. Test in Task 1.

---

### Task 1: Pack contracts and pure logic

**Files:**
- Create: `content/packs.ts`
- Modify: `content/package.json` (`exports["./packs"] = "./packs.ts"`)
- Test: `content/__tests__/packs.test.ts`

**Interfaces:**
- Consumes: `checkCase`, `caseDefinitionSchema`, `CaseDefinition` from `@casefile/engine`; `cases`, `locales`, `Locale`, `CaseContent` from `./index`.
- Produces:
  - `PackMetaSchema`, `type PackMeta`; `ManifestEntrySchema`, `type ManifestEntry`; `ContentManifestSchema`, `type ContentManifest`; `type PackIndex = { clockOffsetMs: number | null; packs: InstalledPack[] }`; `type InstalledPack = { id: string; version: number }`.
  - `type LoadedPack = { meta: PackMeta; definition: unknown; strings: Partial<Record<Locale, Record<string, string>>>; mediaAssetIds: string[] }`
  - `type RegisteredCase = CaseContent & { number: number; access: 'free' | 'premium'; pack: { id: string; version: number } | null }`
  - `packIdFor(caseId: string): string` (`case_004` → `case-004`)
  - `compareVersions(a: string, b: string): number` (semver major.minor.patch)
  - `parseManifest(json: unknown): ContentManifest | null`
  - `chooseIndex(main: string | null, tmp: string | null): PackIndex | null` (valid main wins; else valid tmp; both null → empty index `{ clockOffsetMs: null, packs: [] }`; present but unparsable both → `null`)
  - `clockOffsetMs(serverTime: string, now: Date): number`; `serverNowFrom(offset: number | null, now: Date): Date | null`
  - `planSync(manifest: ContentManifest, installed: InstalledPack[], opts: { appVersion: string; playtest: boolean }): ManifestEntry[]` (entries to download: newer than installed, `minAppVersion` ≤ app, audience allowed)
  - `checkPack(pack: LoadedPack, bundled: CaseContent[], bundledAssetIds: Iterable<string>): string[]` (errors; empty = valid)
  - `isReleased(meta: PackMeta, serverNow: Date | null, ignoreSchedule: boolean): boolean`
  - `mergeCases(bundled: CaseContent[], candidates: LoadedPack[][], opts: { appVersion: string; serverNow: Date | null; ignoreSchedule: boolean; bundledAssetIds: Iterable<string> }): { cases: RegisteredCase[]; media: Record<string, { packId: string; version: number }>; errors: string[] }`. `candidates` is per pack id, newest version first; the first version that passes `checkPack` and the gates wins, so a broken new version falls back to the older installed one. `media` maps asset ID → the pack that provides it. The result is sorted by `number`.

- [ ] **Step 1: Write the failing tests** in `content/__tests__/packs.test.ts`. Build fixtures in the test from `getCase('case_001')`: a pack `case-099` whose definition is case 001's with `id: 'case_099'`, strings copied from case 001, `mediaAssetIds` = case 001's asset IDs, meta `{ id: 'case-099', version: 1, minAppVersion: '1.0.0', caseNumber: 99, access: 'free' }`. Tests:
  - `packIdFor('case_004')` is `'case-004'`; `compareVersions('1.10.0', '1.9.3') > 0`.
  - `chooseIndex(null, null)` equals the empty index; `chooseIndex('{bad', '{"clockOffsetMs":5,"packs":[]}')` returns offset 5; `chooseIndex('{bad', '{bad')` is `null`.
  - `parseManifest({ nope: 1 })` is `null`.
  - `planSync` downloads a pack newer than installed and skips one with `minAppVersion: '9.0.0'`, one already installed at that version, and `audience: 'playtest'` unless `playtest: true`.
  - `checkPack` passes the fixture; it reports an error for a missing English string key, a missing asset ID, `meta.id` ≠ `packIdFor(definition.id)`, and a pack `case-001` whose definition differs from bundled case 001 in any field.
  - `isReleased` with `startsAt: '2026-11-01T00:00:00Z'`: `false` at server time 2026-10-31, `true` at 2026-11-02, `false` when `serverNow` is `null`, `true` when `ignoreSchedule`.
  - `mergeCases` with bundled cases 001–003 plus the fixture: four cases ordered 1, 2, 3, 99; `media['case-01-card']` absent (bundled), fixture media mapped to `{ packId: 'case-099', version: 1 }`.
  - `mergeCases` with candidates `[[v2 broken (missing string), v1 valid]]` returns v1 and one error mentioning `case-099 v2`.
  - `mergeCases` with a pack whose `caseNumber` is 2 (taken by bundled case 002) rejects it with an error; two packs with the same number keep the lower pack id.
  - A pack `case-001` with an identical definition and a changed English title string replaces bundled case 001's strings and keeps number 1.

- [ ] **Step 2: Run** `npx vitest run __tests__/packs.test.ts` in `content/`. Expected: FAIL (module `../packs` not found).

- [ ] **Step 3: Implement `content/packs.ts`** with the interfaces above. `checkPack` runs `checkCase(definition, { strings, assetIds })` once per shipped locale (requires `en`), and compares an override with `JSON.stringify` of both parsed definitions.

- [ ] **Step 4: Run** the same command. Expected: PASS. Then `npm run typecheck --workspace=@casefile/content`.

- [ ] **Step 5: Commit** `feat(content): pack contracts, sync planning and case merging`.

### Task 2: Packs in the content tests, and the pack folder format

**Files:**
- Create: `content/pack-files.ts` (Node only: `loadPackDir(dir: string): LoadedPack`, `loadPacksDir(root: string): LoadedPack[]`; media IDs are `media/*.webp` basenames)
- Create: `content/packs/README.md` (layout, `pack.json`, rules for authors copied from the spec's "Rules for pack authors", publishing steps)
- Modify: `content/__tests__/all-cases.test.ts` (run the suite over `cases` plus every pack in `content/packs/`, merged with `mergeCases` using `ignoreSchedule: true`, `appVersion: '999.0.0'`; a merge error fails the run)
- Modify: `content/package.json` (`exports["./pack-files"] = "./pack-files.ts"`)
- Test: `content/__tests__/pack-files.test.ts`

**Interfaces:**
- Consumes: Task 1 `LoadedPack`, `mergeCases`.
- Produces: `loadPackDir`, `loadPacksDir` (used by Task 3's script and the content tests).

- [ ] **Step 1: Write the failing test** `pack-files.test.ts`: write a temp pack folder (`mkdtempSync`) with `pack.json`, `case.json`, `en.json`, `sk.json`, `media/case-99-card.webp`, `publish.json`; `loadPackDir` returns the meta, the parsed definition, both locales and `mediaAssetIds: ['case-99-card']`; a folder whose `pack.json` id differs from the folder name throws `/must match its folder/`.
- [ ] **Step 2: Run** `npx vitest run __tests__/pack-files.test.ts` (in `content/`). Expected: FAIL.
- [ ] **Step 3: Implement `pack-files.ts`**, then change `all-cases.test.ts` so `describe.each` iterates the merged cases (bundled + `loadPacksDir(join(__dirname, '..', 'packs'))`). Art checks use bundled asset files plus each pack's media.
- [ ] **Step 4: Run** `npm test --workspace=@casefile/content`. Expected: PASS (no packs exist yet, so the suite covers the bundled cases as before).
- [ ] **Step 5: Commit** `feat(content): load case packs from content/packs and test them like bundled cases`.

### Task 3: Building packs for publishing

**Files:**
- Create: `scripts/build-content.mjs` (Outbreak's script adapted. Env: `CONTENT_PACKS_DIR`, `CONTENT_OUT_DIR`, `PUBLISHED_MANIFEST`. It copies `content/packs/<id>/` (minus `publish.json`, `README.md`) to `<out>/<id>/<version>/`, and writes `<out>/manifest.json` as an array of manifest entries with `size`, `sha256`, `md5` per file, plus `caseNumber`, `access`, `audience`, `startsAt?` from `pack.json` / `publish.json`.) Read files as bytes (Outbreak's line-ending fix, commit c5b8386) and add `content/packs/** -text` to `.gitattributes`.
- Test: `content/__tests__/build-content.test.ts` (runs the script with `execFileSync('node', [script], { env })` against temp folders)

**Interfaces:**
- Consumes: none at runtime (plain Node so the publish script needs no TS tooling); the test parses the output with Task 1's `ManifestEntrySchema`.
- Produces: `dist/content/manifest.json`, the input to Task 4's server and Task 5's publish script.

- [ ] **Step 1: Write the failing tests:** one pack → manifest has one entry whose `files` include `pack.json`, `case.json`, `en.json`, `media/x.webp` with correct size/sha256/md5 (computed in the test), and every entry parses with `ManifestEntrySchema`; with `PUBLISHED_MANIFEST` listing the same id+version with a different sha256, the script exits non-zero with `/already published with other files/`; `publish.json` `{ "audience": "playtest" }` → `audience: 'playtest'`.
- [ ] **Step 2: Run** `npx vitest run __tests__/build-content.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement** `scripts/build-content.mjs`.
- [ ] **Step 4: Run** the tests. Expected: PASS.
- [ ] **Step 5: Commit** `feat(scripts): build case packs and their manifest for publishing`.

### Task 4: Content API server

**Files:**
- Create: `apps/server/package.json` (`name: "@casefile/server"`, `type: module`, deps `fastify`, `@casefile/content`; dev `tsup`; scripts `build` (tsup bundling `@casefile/*`), `start`, `typecheck`, `test`)
- Create: `apps/server/tsconfig.json`, `apps/server/tsup.config.ts`
- Create: `apps/server/src/app.ts` — `buildApp(opts: { contentDir: string; now?: () => Date }): FastifyInstance`
- Create: `apps/server/src/main.ts` (listens on `PORT` default `3001`, host `127.0.0.1`, `CONTENT_DIR` default `/var/www/casefile-content`)
- Create: `apps/server/deploy/casefile-server.service`, `apps/server/deploy/casefile-api.cognision.eu.nginx` (proxy `/v1/` to `127.0.0.1:3001`; `location /content/` alias `/var/www/casefile-content/`, `Cache-Control: public, max-age=31536000, immutable`, `manifest.json` → 404, as in Outbreak's `outbreak-api-content.conf`)
- Create: `scripts/deploy-server.sh` (Outbreak's, minus Prisma: build, stage `dist` + runtime `package.json`, upload to `/opt/casefile-server.next`, swap keeping `.prev`, restart `casefile-server`, curl `/v1/health`; ssh host `${CASEFILE_SSH:-cognision-vps}`)
- Create: `docs/server.md` (endpoints, one-time VPS setup: user, folders, DNS `casefile-api.cognision.eu`, certbot, nginx, systemd; deploy and publish commands)
- Test: `apps/server/src/app.test.ts`

**Interfaces:**
- Consumes: Task 1 `ManifestEntrySchema`, `ContentManifest`.
- Produces: `GET /v1/health` → `{ ok: true }`; `GET /v1/content/manifest` → `ContentManifest`.

- [ ] **Step 1: Write the failing tests** with `app.inject`: health returns 200 `{ ok: true }`; manifest with no `manifest.json` returns `{ serverTime: <now().toISOString()>, packs: [] }` and header `cache-control: no-store`; with a valid file returns its entries; with an unparsable file returns `packs: []` (status 200).
- [ ] **Step 2: Run** `npm test --workspace=@casefile/server`. Expected: FAIL.
- [ ] **Step 3: Implement** `app.ts` and `main.ts`. The manifest file is read on every request, so publishing needs no restart.
- [ ] **Step 4: Run** the tests, then `npm run build --workspace=@casefile/server && node apps/server/dist/main.js` with `CONTENT_DIR` pointing at a Task 3 build output, and `curl -s localhost:3001/v1/content/manifest`. Expected: the built entries plus `serverTime`.
- [ ] **Step 5: Commit** `feat(server): content manifest API and VPS deployment`.

### Task 5: Publishing script

**Files:**
- Create: `scripts/publish-content.sh` (Outbreak's flow: `npm test --workspace=@casefile/content`; fetch the live `manifest.json` over ssh as `PUBLISHED_MANIFEST`; run `build-content.mjs`; tar-upload versions to `/var/www/casefile-content`; `sha256sum -c` on the server; replace `manifest.json` last via `.tmp` + `mv`; print the live manifest from `https://casefile-api.cognision.eu/v1/content/manifest`)
- Modify: `content/packs/README.md` (publishing section)

**Interfaces:**
- Consumes: Task 3's script, Task 4's endpoint.
- Produces: nothing other tasks import.

- [ ] **Step 1: Dry-run check:** `bash -n scripts/publish-content.sh` succeeds, and running it with `CASEFILE_SSH=nonexistent-host` fails at the ssh step after the tests and the build have run (that proves the order: checks before upload).
- [ ] **Step 2: Commit** `feat(scripts): publish case packs to the VPS`.

### Task 6: Case registry in the app (no visible change)

**Files:**
- Create: `apps/mobile/src/content/registry.ts` — zustand store `{ cases: RegisteredCase[]; media: Record<string, string> }` (asset ID → file URI); `getCases()`, `useCases()`, `getCase(id)`, `setRegistry(cases, media)`. Initial state: `mergeCases(bundled, [], …).cases`.
- Modify: `apps/mobile/src/content/cases.ts` (re-export from the registry. `artFor` checks bundled `caseArt` and then `registry.media` → `{ uri }`. `totalCases` = cases count + upcoming entries whose number no case has. Export `useUpcomingCases()` that filters `upcomingCases` the same way.)
- Modify: `apps/mobile/src/app/(tabs)/index.tsx` (`useCases()`; card number from `RegisteredCase.number`), `apps/mobile/src/app/case/[caseId]/index.tsx` (number from the case, not `indexOf`)
- Modify: `apps/mobile/src/storage/hydrate.ts` — add `staleCaseIds(byCase: Record<string, CaseProgress>, definitions: CaseDefinition[]): string[]` (saved progress whose `contentVersion` differs from its definition's)
- Modify: `apps/mobile/src/storage/persistence.ts` — keep rows of unknown cases as pending. Export `applyRegistry(definitions: CaseDefinition[])`: hydrates pending rows for newly known cases, and archives and drops in-memory progress whose case is in `staleCaseIds`. Subscribe it to registry changes.
- Test: `apps/mobile/src/storage/hydrate.test.ts`

**Interfaces:**
- Consumes: Task 1 `RegisteredCase`, `mergeCases`.
- Produces: `setRegistry(cases: RegisteredCase[], media: Record<string, string>): void`, used by Task 7; `getCase` / `useCases` used by screens.

- [ ] **Step 1: Write the failing tests:** `staleCaseIds` returns `['case_001']` when saved progress has `contentVersion` 1 and the definition has 2; it returns `[]` for matching versions and for progress of cases not in `definitions`.
- [ ] **Step 2: Run** `npx vitest run src/storage/hydrate.test.ts` (in `apps/mobile`). Expected: FAIL.
- [ ] **Step 3: Implement** the registry, the `cases.ts` changes, the screens and the persistence changes.
- [ ] **Step 4: Run** `npm test && npm run typecheck && npm run lint` at the root. Expected: all pass. The app looks identical (cases 1–3, "coming soon" 4–10).
- [ ] **Step 5: Commit** `refactor(mobile): read cases from a registry that packs can extend`.

### Task 7: Downloading, verifying and activating packs

**Files:**
- Install: `npx expo install expo-file-system` (in `apps/mobile`). Before writing code, read the installed `node_modules/expo-file-system/build/*.d.ts` for `File`, `Directory`, `Paths`, `File.downloadFileAsync`, `File#info({ md5 })`, `File#textSync`, `File#write`, `File#move` (AGENTS.md: never trust remembered Expo APIs).
- Create: `apps/mobile/src/content/config.ts` — `API_URL` (`EXPO_PUBLIC_API_URL` ?? `https://casefile-api.cognision.eu`, no trailing slash), `PLAYTEST` (`EXPO_PUBLIC_PLAYTEST === '1'`), `APP_VERSION` (`Constants.expoConfig?.version ?? '0.0.0'`)
- Create: `apps/mobile/src/content/packStore.ts` — I/O only. Layout `<documents>/packs/index.json` (+ `.tmp`), `<documents>/packs/<id>/<version>/…`.
  - `loadInstalledSync(): { index: PackIndex; packs: LoadedPack[][]; root: string }` (sync, so launch can merge before hydration)
  - `syncPacks(): Promise<{ installed: string[]; failed: string[]; clockOffsetMs: number | null }>`. Never throws: fetch manifest → `parseManifest` → `planSync` → download each file → verify size + MD5 natively → on success add `{ id, version }` to the index → write the index atomically (`.tmp` then move). A failed pack's folder is deleted.
  - `sweepUnused(index: PackIndex): void` (deletes version folders the index doesn't name; skipped if the index was unreadable)
- Create: `apps/mobile/src/content/live.ts` — `loadPacksAtLaunch(): void` (`loadInstalledSync` → `mergeCases` → `setRegistry` with media URIs `<root>/<id>/<version>/media/<assetId>.webp`; logs `errors` with `console.warn`), `refreshPacks(isCalm: () => boolean): Promise<void>` (single-flight; `syncPacks` then, if `isCalm()`, reload and re-merge with the new server offset; otherwise it waits for the next call)
- Modify: `apps/mobile/src/app/_layout.tsx` — call `loadPacksAtLaunch()` before `startPersistence()`; on mount and on `AppState` `active`, `refreshPacks(() => !pathnameRef.current.startsWith('/case/'))` using `usePathname()`.
- Modify: `content/packs/README.md` (how to try a pack against a local server: `EXPO_PUBLIC_API_URL=http://<LAN-IP>:3001`)

**Interfaces:**
- Consumes: Task 1 (`parseManifest`, `planSync`, `chooseIndex`, `mergeCases`, `clockOffsetMs`, `serverNowFrom`, `PackIndex`, `LoadedPack`), Task 6 `setRegistry`, Task 4 server for manual testing.
- Produces: nothing later tasks import.

- [ ] **Step 1: Typecheck:** `npm run typecheck`. Expected: PASS.
- [ ] **Step 2: Bundle check:** `npx expo export --platform android --output-dir <scratch>` in `apps/mobile`. Expected: success.
- [ ] **Step 3: Local end-to-end (manual):** make a test pack `content/packs/case-099/` from case 001 (as in Task 1's fixture, with art copied to `media/`), build it with Task 3, serve it with Task 4 (`CONTENT_DIR=dist/content`), and run a dev build with `EXPO_PUBLIC_API_URL=http://<LAN-IP>:3001`. Expected: after one foreground cycle Case 99 appears in the library with art and is playable; editing its English title, raising `version` and rebuilding updates the title on the next foreground while on the library, but not while a case screen is open; stopping the server leaves everything playable. **Delete the test pack before committing.**
- [ ] **Step 4: Commit** `feat(mobile): download, verify and activate case packs`.

### Task 8: Docs and status

**Files:**
- Modify: `README.md` (layout: `apps/server/`, `content/packs/`; status: live packs; link the spec and `docs/server.md`)
- Modify: `docs/ROADMAP.md` (note live packs under M4; Case 004 as the first live pack)

- [ ] **Step 1:** `npm run format:check && npm run lint && npm run typecheck && npm test`. Expected: all pass.
- [ ] **Step 2: Commit** `docs: live case packs in README and roadmap`.

## After this plan (not part of it)
- The author: DNS record for `casefile-api.cognision.eu`, certificate, one-time VPS setup from `docs/server.md`, `bash scripts/deploy-server.sh`.
- The store build with Case 003 and this system (L1). Then Case 004 authored as `content/packs/case-004/` and published (L3).
