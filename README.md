# Casefile: Five Minutes

An offline-first, neo-noir mobile detective and deduction puzzle game. Players solve short (5–10 minute) cases by inspecting evidence, linking facts, identifying contradictions and submitting supported conclusions.

## Locked product decisions
- **Guided deduction:** select two facts and classify their relationship as supports, contradicts, or same event.
- **Visual style:** modern neo-noir digital forensic software; restrained atmosphere, readable portrait UX.
- **Narrative:** hybrid, with fully standalone cases and optional recurring story connections.
- **Platforms / stack:** Android + iOS, Expo / React Native / TypeScript, Expo Router, Reanimated, Zustand, SQLite; case content from versioned JSON.
- **Offline-first:** all initial cases work without a backend.
- **Monetization:** first 2–3 cases free, single purchase for initial collection, optional later case packs; no energy systems or forced advertisements.

## Project documents
- [Full Game Design Document](docs/GDD.md)
- [Deduction engine & JSON authoring design](docs/ENGINE.md)
- [Case 001 — The Missing Watch](docs/CASE-001.md)
- [Screen-by-screen UX and neo-noir identity](docs/UX.md)
- [Implementation roadmap, PR sequencing and acceptance criteria](docs/ROADMAP.md)
- [Art prompts — image generation brief](docs/ART-PROMPTS.md)
- [Live case packs — design](docs/superpowers/specs/2026-10-31-live-cases-design.md), [pack format](content/packs/README.md) and [content server](docs/server.md)

## Repository layout
```text
apps/mobile/       # Expo app (Expo Router, SDK 58)
apps/server/       # Content API (Fastify): live case-pack manifest and server clock
packages/engine/   # Pure TypeScript deduction engine + Vitest tests
content/           # @casefile/content: case JSON, locales, art assets + content tests
content/packs/     # Live case packs, published without a store release
scripts/           # Pack build/publish and server deploy scripts
docs/              # Product and development references
```

## Getting started
Requires Node 22 (see `.nvmrc`).

```bash
npm install          # install all workspaces
npm start            # Expo dev server for apps/mobile
npm run lint         # ESLint (the engine is blocked from importing React / RN / Expo)
npm run typecheck    # tsc across workspaces
npm test             # engine unit tests (Vitest)
npm run format       # Prettier
```

CI (`.github/workflows/ci.yml`) runs format check, lint, typecheck, tests and an Android/iOS bundle export.

## Status
M0 scaffold and M1 engine: Expo app shell, CI, and a tested deduction engine with case validator and solver (`packages/engine`). Cases 001 and 002 are authored, validated (`content/`) and fully playable in the app, from the library through evidence, comparison, the deduction board, the follow-up search, the final report and the resolution. Progress autosaves (SQLite on devices) and survives restarts. Tiered hints, optional UI sounds (off by default), a reduce-motion setting that follows the device by default, and screen-reader and large-text support are in place. Live case packs: new cases can ship from `content/packs/` through the content API (`apps/server`) without a store release; phones download and verify them in the background and switch them on only while no case is open. The VPS setup in `docs/server.md` is still to be done. An earlier exploratory engine ZIP has **not** been imported or independently verified.

**Next:** blind playtests of Cases 001–002, then `content: complete initial case collection` (Case 003 onward).
