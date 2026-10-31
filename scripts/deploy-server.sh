#!/usr/bin/env bash
# Deploys the Casefile content API to the cognision.eu VPS (docs/server.md).
#   bash scripts/deploy-server.sh            (ssh host alias: cognision-vps, override with CASEFILE_SSH)
# Builds locally, ships the bundle, installs production dependencies on the server and restarts
# the systemd service. The previous release stays in /opt/casefile-server.prev for a quick rollback.
set -euo pipefail
HOST="${CASEFILE_SSH:-cognision-vps}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SERVER="$ROOT/apps/server"
STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT

echo "[1/4] Testing and building"
npm test --workspace=@casefile/server >/dev/null
npm run build --workspace=@casefile/server >/dev/null

echo "[2/4] Staging"
cp -r "$SERVER/dist" "$STAGE/"
# Runtime manifest: npm dependencies only; workspace packages are bundled into dist/main.js.
node -e '
  const pkg = require(process.argv[1]);
  const deps = Object.fromEntries(Object.entries(pkg.dependencies).filter(([n]) => !n.startsWith("@casefile/")));
  console.log(JSON.stringify({ name: "casefile-server", private: true, type: "module", dependencies: deps }, null, 2));
' "$SERVER/package.json" > "$STAGE/package.json"

echo "[3/4] Uploading to $HOST"
ssh "$HOST" 'mkdir -p /opt/casefile-server.next && rm -rf /opt/casefile-server.next/*'
tar -czf - -C "$STAGE" . | ssh "$HOST" 'tar -xzf - -C /opt/casefile-server.next'

echo "[4/4] Installing and restarting"
ssh "$HOST" 'set -e
  id casefile >/dev/null 2>&1 || useradd --system --home-dir /opt/casefile-server --shell /usr/sbin/nologin casefile
  cd /opt/casefile-server.next && npm install --omit=dev --no-audit --no-fund --loglevel=error
  rm -rf /opt/casefile-server.prev
  [ -d /opt/casefile-server ] && mv /opt/casefile-server /opt/casefile-server.prev
  mv /opt/casefile-server.next /opt/casefile-server
  chown -R casefile:casefile /opt/casefile-server
  systemctl restart casefile-server
  sleep 2
  systemctl is-active casefile-server
  curl -fsS http://127.0.0.1:3001/v1/health && echo'
echo "Deployed."
