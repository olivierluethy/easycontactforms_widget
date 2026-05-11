// Build config for the @easycontact/react package.
//
// Two important compiler choices:
//   1. `jsx: 'automatic'` — uses React 17+'s automatic JSX runtime so the
//      bundle imports `jsx`/`jsxs` from `react/jsx-runtime` rather than
//      relying on a bare `React.createElement` global. Without this, the
//      classic transform produces calls to `React.createElement(...)` even
//      though our source only imports `{ useState }`, causing
//      `ReferenceError: React is not defined` at consumer render time.
//   2. `'use client'` banner — keeps the directive at the top of every
//      published bundle so the component itself is the client boundary in
//      Next.js App Router, and consumers don't need a `"use client"` line
//      in their own page.

import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.js'],
  format: ['esm', 'cjs'],
  target: 'es2019',
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  clean: true,
  sourcemap: true,
  banner: { js: '"use client";' },
  loader: { '.js': 'jsx', '.jsx': 'jsx' },
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
});
