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

## Status
Planning baseline only. Neither the Expo app nor the TypeScript engine is implemented in this repository yet. An earlier exploratory engine ZIP has **not** been imported or independently verified.

**Next:** scaffold an Expo monorepo, implement a pure TypeScript game engine and validator, and ship one complete playable Case 001 before expanding content.
