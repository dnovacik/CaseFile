# Case packs

Cases that reach players without a store release. Design: `docs/superpowers/specs/2026-10-31-live-cases-design.md`.

## Layout

```
content/packs/<id>/          e.g. content/packs/case-004/
  pack.json      what the pack is (below)
  case.json      the case definition, same schema as content/cases/*/case.json
  en.json        English strings (required)
  sk.json        Slovak strings (every language the app supports at minAppVersion)
  media/         art as <asset-id>.webp, e.g. media/case-04-briefing.webp
  publish.json   optional: { "audience": "playtest" } to ship to test builds only
```

`pack.json`:

```json
{
  "id": "case-004",
  "version": 1,
  "minAppVersion": "1.0.0",
  "caseNumber": 4,
  "access": "free"
}
```

- `id` is the case's `id` with `-` for `_` (`case_004` ↔ `case-004`) and matches the folder.
- `version` is a whole number from 1. Raise it for **every** change you publish; a published version never changes.
- `caseNumber` places the case in the library and replaces that number's "coming soon" card.
- `access` is `free` or `premium`. It isn't enforced until billing exists.
- Optional `startsAt` (UTC, e.g. `"2026-12-01T09:00:00Z"`) releases the case at that time by the **server's** clock.
- Asset IDs are global: name art `case-NN-*` after the case number.

## Rules

- **IDs are permanent.** Never rename a case, evidence, fact, relationship, deduction, action or conclusion ID once published.
- **Text and art fixes** keep `contentVersion` and leave the definition unchanged, so players keep their progress. A **structural change** raises `contentVersion` and resets players' progress in that case (archived, not deleted). Prefer text fixes.
- A pack may replace a **bundled** case (same `id`, same `caseNumber`) for text and art fixes only; its definition must be identical.
- Every case passes the same fair-play suite as bundled cases (`content/__tests__/all-cases.test.ts`), in every language it ships, with every referenced asset present. A case's own checks go in `content/__tests__/case-NNN.test.ts`.

## Checks and publishing

`npm test --workspace=@casefile/content` validates and solves every pack here, exactly like the bundled cases.

Publishing, by the author only, after the pack's PR is merged: `bash scripts/publish-content.sh` (see `docs/server.md`). Phones pick a pack up on their next launch or return to the app, never while a case is open.

To try a pack on test builds first, add `publish.json` with `{ "audience": "playtest" }` and use a build made with `EXPO_PUBLIC_PLAYTEST=1`. Then delete `publish.json`, raise `version` and publish again for everyone.

## Trying a pack against a local server

1. `node scripts/build-content.mjs`, then `npm run build --workspace=@casefile/server` and `CONTENT_DIR=dist/content PORT=3001 node apps/server/dist/main.js`.
2. Serve the pack files too: put `dist/content` behind the same host under `/content/` (nginx locally, or any static server on the same port via a proxy).
3. Start a dev build with `EXPO_PUBLIC_API_URL=http://<your LAN IP>:3001` (and `EXPO_PUBLIC_PLAYTEST=1` for playtest packs).
4. Send the app to the background and back while on the library: the case appears. Packs never switch while a case is open.
