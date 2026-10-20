#!/usr/bin/env node
// Builds a Vite frontend as a few flat, unminified files for Figma Make.
//
//   node build-flat.mjs --frontend frontend --out /tmp/out [--limit 900000] [--bundle-deps]
//
// Runs the project's own Vite (and its vite.config) with these overrides, nothing else changed:
//   minify off, no source maps, one CSS file (app.css), relative base, no inlined assets,
//   entry named app.js, chunks named by module so there are no hashes.
// By default every package in package.json "dependencies" stays an external import (Figma Make
// installs packages itself), so the output needs Make to run. --bundle-deps inlines them for a
// folder that runs on its own.
// If any .js file is over --limit bytes, rebuilds split into chunks of at most --limit bytes
// (Vite 8+/Rolldown), or grouped by directory (src/<dir>, then deeper) on Vite 7 and earlier,
// until every file fits or splitting stops helping. A single module over the limit can't be split.
// Output may still hold subfolders (public/ files, fonts); flatten.mjs deals with those.

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const args = Object.fromEntries(process.argv.slice(2).reduce((acc, a, i, all) => {
  if (a.startsWith('--')) acc.push([a.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : true]);
  return acc;
}, []));
const frontend = path.resolve(args.frontend || '.');
const out = path.resolve(args.out || 'figma-out');
const limit = Number(args.limit) || 900_000;
const bundleDeps = !!args['bundle-deps'];
const MAX_DEPTH = 4;

const req = createRequire(path.join(frontend, 'package.json'));
let vite;
try { vite = await import(pathToFileURL(req.resolve('vite')).href); }
catch { console.error(`vite not found from ${frontend} — run npm install there first.`); process.exit(1); }

const rolldown = Number(String(vite.version).split('.')[0]) >= 8; // Vite 8+ bundles with Rolldown: size-based splitting instead of manualChunks
const pkg = JSON.parse(fs.readFileSync(path.join(frontend, 'package.json'), 'utf8'));
const deps = Object.keys(pkg.dependencies || {});
const isExternal = (id) => deps.some((d) => id === d || id.startsWith(d + '/'));

// Directory key for a module: src/<first `depth` segments>, or node_modules/<package>.
function groupOf(id, depth) {
  const nm = id.split('node_modules/');
  if (nm.length > 1) {
    const parts = nm.at(-1).split('/');
    return 'vendor-' + (parts[0].startsWith('@') ? parts[0] + '-' + parts[1] : parts[0]).replace('@', '');
  }
  const rel = path.relative(path.join(frontend, 'src'), id);
  if (rel.startsWith('..')) return undefined;
  const segs = rel.split(path.sep).slice(0, -1).slice(0, depth);
  return segs.length ? segs.join('-') : 'app-core';
}

async function build(depth) {
  const loaded = await vite.loadConfigFromFile({ command: 'build', mode: 'production' }, undefined, frontend);
  const overrides = {
    root: frontend,
    base: './',
    logLevel: 'warn',
    build: {
      outDir: out, emptyOutDir: true, minify: false, cssMinify: false, sourcemap: false,
      cssCodeSplit: false, assetsInlineLimit: 0, reportCompressedSize: false,
      rollupOptions: {
        ...(bundleDeps ? {} : { external: isExternal }),
        output: {
          entryFileNames: 'app.js',
          chunkFileNames: '[name].js',
          assetFileNames: (a) => ((a.names?.[0] || a.name || '').endsWith('.css') ? 'app.css' : '[name][extname]'),
          ...(!depth ? {} : rolldown
            ? { codeSplitting: { groups: [{ name: 'app', test: /.*/, maxSize: limit }] } }
            : { manualChunks: (id) => groupOf(id, depth) }),
        },
      },
    },
  };
  const merged = vite.mergeConfig(loaded?.config || {}, overrides);
  // mergeConfig concatenates arrays and objects; make sure our output naming wins over any inherited one.
  merged.build.rollupOptions.output = Array.isArray(merged.build.rollupOptions.output)
    ? overrides.build.rollupOptions.output : { ...merged.build.rollupOptions.output, ...overrides.build.rollupOptions.output };
  if (!depth) merged.build.rollupOptions.output[rolldown ? 'codeSplitting' : 'inlineDynamicImports'] = rolldown ? false : true;
  await vite.build({ ...merged, configFile: false });
}

const jsFiles = (dir) => fs.readdirSync(dir, { recursive: true, withFileTypes: true })
  .filter((e) => e.isFile() && /\.m?js$/.test(e.name)).map((e) => path.join(e.parentPath, e.name));
const oversized = () => jsFiles(out).filter((f) => fs.statSync(f).size > limit);

let depth = 0;
await build(depth);
while (oversized().length && depth < (rolldown ? 1 : MAX_DEPTH)) {
  const before = oversized().length;
  depth++;
  console.log(`${before} file(s) over ${limit} bytes — rebuilding with chunks ${rolldown ? 'split by size' : `grouped ${depth} level(s) deep`}`);
  await build(depth);
}
const still = oversized();
console.log(`Built ${jsFiles(out).length} JS file(s) in ${out}${depth ? (rolldown ? ' (split by size)' : ` (chunk depth ${depth})`) : ''}${bundleDeps ? ', dependencies bundled in' : `, ${deps.length} dependencies left as external imports`}`);
if (still.length) console.log('Still over the limit: ' + still.map((f) => `${path.relative(out, f)} (${fs.statSync(f).size})`).join(', '));
