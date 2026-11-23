import { build } from 'esbuild';
import { mkdir, copyFile, readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('..', import.meta.url)),
  out = resolve(root, 'vendor/supabase');
await mkdir(join(out, 'licenses'), { recursive: true });
await build({
  stdin: {
    contents: "export {createClient} from '@supabase/supabase-js';",
    resolveDir: root,
    sourcefile: 'supabase-entry.js',
  },
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  legalComments: 'linked',
  minify: true,
  outfile: join(out, 'client.mjs'),
});
const modules = resolve(root, 'node_modules/.pnpm');
for (const entry of await readdir(modules)) {
  if (entry.startsWith('.')) continue;
  const folder = join(modules, entry, 'node_modules');
  let packages = [];
  try {
    for (const name of await readdir(folder)) {
      if (name.startsWith('@'))
        for (const sub of await readdir(join(folder, name))) packages.push(join(folder, name, sub));
      else packages.push(join(folder, name));
    }
  } catch {
    continue;
  }
  for (const pkg of packages) {
    try {
      const info = JSON.parse(await readFile(join(pkg, 'package.json'), 'utf8'));
      for (const name of await readdir(pkg))
        if (/^license(?:\..*)?$/i.test(name))
          await copyFile(
            join(pkg, name),
            join(out, 'licenses', info.name.replaceAll('/', '-') + '-' + name),
          );
    } catch {}
  }
}
await writeFile(
  join(out, 'README.md'),
  '# Supabase Browser Client\n\nBundled from @supabase/supabase-js 2.119.0 with esbuild 0.28.2. Exact dependencies are pinned in pnpm-lock.yaml. Regenerate with `pnpm run bundle:auth`. Upstream licenses are retained in licenses/. No service-role keys are included.\n',
);
console.log('Pinned browser client and upstream licenses generated.');
