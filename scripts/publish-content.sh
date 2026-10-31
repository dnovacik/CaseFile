#!/usr/bin/env bash
# Publishes content/packs/ to players (docs/server.md, content/packs/README.md): checks every pack,
# uploads new pack versions to the cognision.eu VPS, then replaces the manifest the API serves at
# https://casefile-api.cognision.eu/v1/content/manifest.
#   bash scripts/publish-content.sh       (ssh host alias: cognision-vps, override with CASEFILE_SSH)
set -euo pipefail
HOST="${CASEFILE_SSH:-cognision-vps}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REMOTE=/var/www/casefile-content
API="${CASEFILE_API:-https://casefile-api.cognision.eu}"

echo "Checking packs (validation and play-throughs)"
npm --prefix "$ROOT" test --workspace=@casefile/content

# Published versions never change: the build refuses a published version with different files.
echo "Reading the live manifest from $HOST"
mkdir -p "$ROOT/dist"
ssh "$HOST" "cat $REMOTE/manifest.json 2>/dev/null || echo '[]'" > "$ROOT/dist/published-manifest.json"
PUBLISHED_MANIFEST="$ROOT/dist/published-manifest.json" node "$ROOT/scripts/build-content.mjs"

echo "Uploading pack versions to $HOST"
# Rewriting a published version is safe (the build proved its files are the same) and repairs an upload cut short.
tar -czf - -C "$ROOT/dist/content" --exclude=manifest.json . | ssh "$HOST" "mkdir -p $REMOTE && tar -xzf - -C $REMOTE"

echo "Checking every file on the server against the manifest"
node -e '
  const m = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));
  for (const p of m) for (const f of p.files) console.log(`${f.sha256}  ${p.id}/${p.version}/${f.path}`);' \
  "$ROOT/dist/content/manifest.json" | ssh "$HOST" "cd $REMOTE && sha256sum -c --quiet -"

# The manifest goes last and in one move, so phones never see a pack whose files aren't there yet.
ssh "$HOST" "cat > $REMOTE/manifest.json.tmp && mv $REMOTE/manifest.json.tmp $REMOTE/manifest.json && chown -R www-data:www-data $REMOTE" \
  < "$ROOT/dist/content/manifest.json"

echo "Live manifest:"
curl -fsS "$API/v1/content/manifest" | node -e '
  let s = ""; process.stdin.on("data", d => s += d).on("end", () => {
    const m = JSON.parse(s); console.log("serverTime", m.serverTime);
    for (const p of m.packs) console.log(" ", p.id, "v" + p.version, p.audience, p.files.length + " files"); });'
