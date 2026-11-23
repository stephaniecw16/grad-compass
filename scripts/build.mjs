// Publish only student planning assets. Repository documents, .env files, tooling,
// tests and Git metadata never enter the hosted output.
import { copyFile, mkdir, rm, writeFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
try {
  process.loadEnvFile(resolve(root, '.env.local'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const url = process.env.SUPABASE_URL || '',
  key = process.env.SUPABASE_PUBLISHABLE_KEY || '';
if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url) || !key.startsWith('sb_publishable_'))
  throw Error('Set SUPABASE_URL and the browser-safe SUPABASE_PUBLISHABLE_KEY before building.');
const dist = resolve(root, 'dist');
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
const manifest = JSON.parse(await readFile(resolve(root, 'config/public-assets.json'), 'utf8'));
for (const name of manifest) {
  if (
    typeof name !== 'string' ||
    name.includes('..') ||
    name.startsWith('/') ||
    name.split('/').some((part) => part.startsWith('.')) ||
    !(
      /^(src|styles|vendor|demo-files)\//.test(name) ||
      [
        'account.html',
        'index.html',
        'recommend.html',
        'recommend-online.html',
        'coursework.html',
        'staff.html',
        'workspace.html',
      ].includes(name)
    )
  )
    throw Error('Invalid public asset path');
  const destination = resolve(dist, name);
  await mkdir(resolve(destination, '..'), { recursive: true });
  await copyFile(resolve(root, name), destination);
}
await writeFile(
  resolve(dist, 'public-config.json'),
  JSON.stringify({ supabaseUrl: url, supabasePublishableKey: key }),
);
console.log(
  'Static build ready: student planning assets and two browser-safe configuration values.',
);
