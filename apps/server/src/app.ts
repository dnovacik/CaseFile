import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { ManifestEntrySchema, type ContentManifest } from '@casefile/content/packs';
import Fastify, { type FastifyInstance } from 'fastify';

/**
 * The content API (docs/superpowers/specs/2026-10-31-live-cases-design.md). scripts/publish-content.sh
 * writes <contentDir>/manifest.json next to the pack files, which nginx serves under /content/.
 * The manifest is read on every request, so publishing needs no restart. Public: packs hold
 * game content only.
 */
export function buildApp(opts: { contentDir: string; now?: () => Date }): FastifyInstance {
  const now = opts.now ?? (() => new Date());
  const app = Fastify({ logger: process.env.NODE_ENV === 'production' });
  const manifestFile = join(opts.contentDir, 'manifest.json');

  app.get('/v1/health', async () => ({ ok: true }));

  app.get('/v1/content/manifest', async (_req, reply): Promise<ContentManifest> => {
    reply.header('Cache-Control', 'no-store');
    const serverTime = now().toISOString();
    let raw: string;
    try {
      raw = readFileSync(manifestFile, 'utf8');
    } catch {
      return { serverTime, packs: [] };
    }
    try {
      return { serverTime, packs: ManifestEntrySchema.array().parse(JSON.parse(raw)) };
    } catch (error) {
      app.log.warn(`unreadable ${manifestFile}: ${String(error)}`);
      return { serverTime, packs: [] };
    }
  });

  return app;
}
