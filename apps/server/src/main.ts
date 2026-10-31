import { buildApp } from './app';

const port = Number(process.env.PORT ?? 3001);
const contentDir = process.env.CONTENT_DIR ?? '/var/www/casefile-content';

// nginx proxies /v1/ to this port; it never listens publicly.
buildApp({ contentDir })
  .listen({ port, host: '127.0.0.1' })
  .then((address) => console.log(`Casefile content API on ${address}, content in ${contentDir}`))
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
