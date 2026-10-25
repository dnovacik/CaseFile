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

## Repository layout
```text
apps/mobile/       # Expo app (Expo Router, SDK 58)
packages/engine/   # Pure TypeScript deduction engine + Vitest tests
content/cases/     # Authored case JSON + locales
content/assets/    # Photo / audio / media
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
M0 scaffold: Expo app shell, engine package and CI. The deduction engine and Case 001 content are not implemented yet. An earlier exploratory engine ZIP has **not** been imported or independently verified.

**Next:** `feat(engine): implement case schema and deterministic deduction reducer`.
