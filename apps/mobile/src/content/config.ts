import Constants from 'expo-constants';

/** The content API (docs/server.md). Builds can point at a local server with EXPO_PUBLIC_API_URL. */
export const API_URL = (
  process.env.EXPO_PUBLIC_API_URL ?? 'https://casefile-api.cognision.eu'
).replace(/\/+$/, '');

/** Test builds (EXPO_PUBLIC_PLAYTEST=1) also receive packs published for playtesters. */
export const PLAYTEST = process.env.EXPO_PUBLIC_PLAYTEST === '1';

/** Compared with a pack's minAppVersion. */
export const APP_VERSION = Constants.expoConfig?.version ?? '0.0.0';
