// Validate source syntax and published dependencies without importing browser controllers.
import { readdir, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
if (Number(process.versions.node.split('.')[0]) < 22) throw Error('Use Node 22 or newer.');
async function filesIn(folder) {
  const entries = await readdir(folder, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) =>
        entry.isDirectory() ? filesIn(resolve(folder, entry.name)) : [resolve(folder, entry.name)],
      ),
    )
  ).flat();
}
const files = [
  ...(await filesIn('src')),
  ...(await filesIn('scripts')),
  ...(await filesIn('tests/e2e')),
];
for (const file of files.filter((name) => /\.(m?js)$/.test(name))) {
  const result = spawnSync(process.execPath, ['--check', file], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
}
const manifest = JSON.parse(await readFile('config/public-assets.json', 'utf8'));
if (new Set(manifest).size !== manifest.length) throw Error('Duplicate public asset.');
for (const file of manifest) {
  if (file.startsWith('/') || file.split('/').some((part) => part.startsWith('.')))
    throw Error('Invalid public asset path.');
  await readFile(file);
}
const paths = spawnSync('python3', ['scripts/check_paths.py'], { stdio: 'inherit' });
if (paths.status !== 0) process.exit(paths.status || 1);
console.log('Student source syntax and hosted dependencies verified.');
