# Content server

The Casefile content API serves the live case-pack manifest (design: `docs/superpowers/specs/2026-10-31-live-cases-design.md`). It runs on the cognision.eu VPS next to Outbreak's API, at `https://casefile-api.cognision.eu`. It has no database and no accounts.

## Endpoints

| Method | Path | Response |
|---|---|---|
| GET | `/v1/health` | `{ ok: true }` |
| GET | `/v1/content/manifest` | `{ serverTime, packs }`: the published packs (`<CONTENT_DIR>/manifest.json`), leaving out any whose `startsAt` is still ahead, and the server's clock, which decides pack release dates. `Cache-Control: no-store`. A missing or damaged manifest gives `packs: []`, never an error. |
| GET | `/content/<id>/<version>/<file>` | Pack files, served by nginx from `/var/www/casefile-content/`. Immutable. |

The app uses `https://casefile-api.cognision.eu` unless it's built with `EXPO_PUBLIC_API_URL` (e.g. `http://192.168.0.200:3001` for a local server).

## Run locally

```bash
node scripts/build-content.mjs                              # content/packs → dist/content
npm run build --workspace=@casefile/server
CONTENT_DIR=dist/content PORT=3001 node apps/server/dist/main.js
curl localhost:3001/v1/content/manifest
```

Locally, the pack files themselves aren't served (nginx does that on the VPS). To try packs on a phone, serve `dist/content` under `/content/` as well, e.g. with `npx serve`, or put nginx in front.

## One-time VPS setup

1. **DNS:** an `A` record (and `AAAA` if used) for `casefile-api.cognision.eu` pointing at the VPS.
2. **Folders:**
   ```bash
   mkdir -p /var/www/casefile-content && chown www-data:www-data /var/www/casefile-content
   ```
   The API reads the manifest as the `casefile` user, so the folder must stay world-readable (the default).
3. **nginx:** copy `apps/server/deploy/casefile-api.cognision.eu.nginx` to `/etc/nginx/sites-available/`, link it into `sites-enabled/`, then `nginx -t && systemctl reload nginx`.
4. **HTTPS:** `certbot --nginx -d casefile-api.cognision.eu`.
5. **Service:** copy `apps/server/deploy/casefile-server.service` to `/etc/systemd/system/`, then `systemctl daemon-reload && systemctl enable casefile-server`.
6. **First deploy:** `bash scripts/deploy-server.sh` from your machine.

The scripts use the ssh host alias `cognision-vps`, the same one Outbreak uses; override it with `CASEFILE_SSH`.

## Deploying the API

`bash scripts/deploy-server.sh` tests and builds the server locally, uploads it to `/opt/casefile-server`, installs production dependencies and restarts the service. The previous release stays in `/opt/casefile-server.prev`; to roll back, swap the folders and `systemctl restart casefile-server`.

## Publishing case packs

`bash scripts/publish-content.sh` (author only, after a pack's PR is merged; details in `content/packs/README.md`):

1. runs the content tests (every pack is validated and played through);
2. builds `dist/content/` and refuses to change a version that's already live;
3. uploads the new versions to `/var/www/casefile-content/<id>/<version>/` and checks every file's SHA-256 on the server;
4. replaces `manifest.json` **last**, in one move, so phones never see a pack whose files aren't there yet;
5. prints the live manifest.

Phones pick new packs up on their next launch or return to the app.

To withdraw a pack, delete its folder from `content/packs/` and publish again. Phones keep what they installed (saves may refer to it) but stop getting updates for it.
