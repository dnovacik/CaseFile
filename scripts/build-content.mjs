// Builds case packs for publishing (docs/superpowers/specs/2026-10-31-live-cases-design.md):
// copies each content/packs/<id>/ to dist/content/<id>/<version>/ and writes
// dist/content/manifest.json with every file's size, SHA-256 and MD5 (phones check MD5 natively).
// Validation and play-throughs are the content tests, which scripts/publish-content.sh runs first.
// A published version never changes: with PUBLISHED_MANIFEST (the live manifest), a pack whose
// version is already published with other files is refused.
//   node scripts/build-content.mjs   (CONTENT_PACKS_DIR / CONTENT_OUT_DIR override the folders)
import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packsDir = resolve(process.env.CONTENT_PACKS_DIR ?? join(root, 'content/packs'));
const outDir = resolve(process.env.CONTENT_OUT_DIR ?? join(root, 'dist/content'));
const SKIP = new Set(['publish.json', 'README.md']);
const published = process.env.PUBLISHED_MANIFEST
  ? JSON.parse(readFileSync(process.env.PUBLISHED_MANIFEST, 'utf8'))
  : [];

const fail = (message) => {
  console.error(message);
  process.exit(1);
};
const walk = (dir) =>
  readdirSync(dir).flatMap((name) =>
    statSync(join(dir, name)).isDirectory() ? walk(join(dir, name)) : [join(dir, name)],
  );
const fingerprint = (files) =>
  files
    .map((f) => `${f.path}:${f.size}:${f.sha256}`)
    .sort()
    .join('|');
const hash = (algo, bytes) => createHash(algo).update(bytes).digest('hex');

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
const manifest = [];
for (const id of existsSync(packsDir) ? readdirSync(packsDir).sort() : []) {
  const dir = join(packsDir, id);
  if (!statSync(dir).isDirectory() || !existsSync(join(dir, 'pack.json'))) continue;
  const pack = JSON.parse(readFileSync(join(dir, 'pack.json'), 'utf8'));
  if (pack.id !== id) fail(`${id}/pack.json: id is "${pack.id}", must match its folder`);
  if (!Number.isInteger(pack.version) || pack.version < 1) {
    fail(`${id}: version must be a whole number from 1`);
  }
  const publish = existsSync(join(dir, 'publish.json'))
    ? JSON.parse(readFileSync(join(dir, 'publish.json'), 'utf8'))
    : {};
  const audience = publish.audience ?? 'all';
  if (audience !== 'all' && audience !== 'playtest') {
    fail(`${id}/publish.json: audience must be "all" or "playtest"`);
  }
  const target = join(outDir, id, String(pack.version));
  const files = walk(dir)
    .map((file) => relative(dir, file).split('\\').join('/'))
    .filter((path) => !SKIP.has(path))
    .sort()
    .map((path) => {
      // Bytes, never text: a checkout's line endings must not change what phones verify.
      const bytes = readFileSync(join(dir, path));
      mkdirSync(dirname(join(target, path)), { recursive: true });
      writeFileSync(join(target, path), bytes);
      return { path, size: bytes.length, sha256: hash('sha256', bytes), md5: hash('md5', bytes) };
    });
  const live = published.find((p) => p.id === id && p.version === pack.version);
  if (live && fingerprint(live.files) !== fingerprint(files)) {
    fail(
      `${id} v${pack.version} is already published with other files: raise "version" in ${id}/pack.json`,
    );
  }
  manifest.push({
    id,
    version: pack.version,
    minAppVersion: pack.minAppVersion,
    caseNumber: pack.caseNumber,
    access: pack.access,
    ...(pack.startsAt ? { startsAt: pack.startsAt } : {}),
    audience,
    files,
  });
  console.log(`${id} v${pack.version} (${audience}): ${files.length} files`);
}
writeFileSync(join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(
  `Wrote ${relative(root, join(outDir, 'manifest.json'))} with ${manifest.length} pack(s)`,
);
