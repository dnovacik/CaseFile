/**
 * Bundled art for every asset ID the cases reference. Kept apart from index.ts because image
 * requires only resolve in the Metro bundler, not in Node tests. content tests check coverage.
 */
export const caseArt = {
  'case-01-briefing': require('./assets/cases/case-01-briefing.webp'),
  'case-01-card': require('./assets/cases/case-01-card.webp'),
  'case-01-cast-adrian': require('./assets/cases/case-01-cast-adrian.webp'),
  'case-01-cast-elena': require('./assets/cases/case-01-cast-elena.webp'),
  'case-01-cast-marcus': require('./assets/cases/case-01-cast-marcus.webp'),
  'case-01-cast-thomas': require('./assets/cases/case-01-cast-thomas.webp'),
  'case-01-e07': require('./assets/cases/case-01-e07.webp'),
  'case-01-e08': require('./assets/cases/case-01-e08.webp'),
  'case-01-e09': require('./assets/cases/case-01-e09.webp'),
  'case-01-loc-exterior': require('./assets/cases/case-01-loc-exterior.webp'),
  'case-01-loc-office': require('./assets/cases/case-01-loc-office.webp'),
  'case-01-loc-print-room': require('./assets/cases/case-01-loc-print-room.webp'),
  'case-01-loc-security-desk': require('./assets/cases/case-01-loc-security-desk.webp'),
  'case-02-card': require('./assets/cases/case-02-card.webp'),
  'case-03-card': require('./assets/cases/case-03-card.webp'),
  'case-04-card': require('./assets/cases/case-04-card.webp'),
  'case-05-card': require('./assets/cases/case-05-card.webp'),
  'case-06-card': require('./assets/cases/case-06-card.webp'),
  'case-07-card': require('./assets/cases/case-07-card.webp'),
  'case-08-card': require('./assets/cases/case-08-card.webp'),
  'case-09-card': require('./assets/cases/case-09-card.webp'),
  'case-10-card': require('./assets/cases/case-10-card.webp'),
} as const;

export type CaseArtId = keyof typeof caseArt;
