import { cases as bundled } from '@casefile/content';
import { caseArt } from '@casefile/content/art';
import { mergeCases, type RegisteredCase } from '@casefile/content/packs';
import { create } from 'zustand';

export type { RegisteredCase };

/** Asset IDs bundled with the app; packs may add to them (docs/superpowers/specs/2026-10-31-live-cases-design.md). */
export const bundledAssetIds = Object.keys(caseArt);

type RegistryState = {
  /** Playable cases, bundled and from active packs, in library order. */
  cases: RegisteredCase[];
  /** Pack art: asset ID → file URI on the phone. Bundled art is looked up in caseArt. */
  media: Record<string, string>;
};

const initial = mergeCases(bundled, [], {
  appVersion: '0.0.0',
  serverNow: null,
  ignoreSchedule: false,
  bundledAssetIds,
});

/**
 * The cases the app plays from right now. Starts with the bundled cases; live packs replace the
 * contents through setRegistry, only while no case screen is open.
 */
export const useRegistry = create<RegistryState>(() => ({ cases: initial.cases, media: {} }));

export const getCases = (): RegisteredCase[] => useRegistry.getState().cases;
export const useCases = (): RegisteredCase[] => useRegistry((state) => state.cases);
export const getCase = (id: string): RegisteredCase | undefined =>
  getCases().find((c) => c.definition.id === id);

export function setRegistry(cases: RegisteredCase[], media: Record<string, string>): void {
  useRegistry.setState({ cases, media });
}
