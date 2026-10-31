import { defineConfig } from 'tsup';

// One self-contained bundle: workspace packages (TypeScript sources and case JSON) are inlined,
// npm dependencies stay external and are installed on the server.
export default defineConfig({
  entry: ['src/main.ts'],
  format: ['esm'],
  platform: 'node',
  target: 'node22',
  sourcemap: true,
  clean: true,
  noExternal: [/^@casefile\//],
});
