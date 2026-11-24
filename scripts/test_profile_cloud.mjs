// Opt-in online beta check. Uses only the two reserved fictional Pilot accounts.
// Credentials stay in ignored operator-provided files; no traces or session dumps.
// Every test profile/plan is restored in finally, even if an assertion fails.
import { readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as pause } from 'node:timers/promises';
import assert from 'node:assert/strict';
import { chromium, webkit, expect } from '@playwright/test';
import { createClient } from '../vendor/supabase/client.mjs';
import { loadPlan, writePlan } from '../src/planner/plan-store.js';

assert.ok(
  process.env.GRADAPP_CONFIG_FILE && process.env.GRADAPP_TEST_ACCOUNTS,
  'Provide ignored configuration and fictional-account paths.',
);
process.loadEnvFile(process.env.GRADAPP_CONFIG_FILE);
assert.equal(process.env.SUPABASE_URL, 'https://ngcrddnjkkgotlmrnxkf.supabase.co');
const credentials = JSON.parse(await readFile(process.env.GRADAPP_TEST_ACCOUNTS, 'utf8'));
assert.equal(credentials.length, 2);
assert.ok(
  credentials.every(
    (c) => c.fictional && /^gradapp-coursework-[ab]@example\.invalid$/.test(c.email),
  ),
);
const client = () =>
  createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
const clients = [client(), client()];
const anonymous = client();
const originals = [];
const users = [];
const browsers = [];
const contexts = [];
const browserErrors = [];
const backup = join(tmpdir(), 'gradapp-fictional-profile-beta-' + Date.now() + '.json');
let server;
const base = 'http://127.0.0.1:5244';
const profiles = [
  {
    name: 'Fictional Beta Student A',
    college: 'Example Beta College A',
    interests: 'Geometry and probability — fictional beta record',
  },
  {
    name: 'Fictional Beta Student B',
    college: 'Example Beta College B',
    interests: 'Analysis and statistics — fictional beta record',
  },
];
async function signIn(browser, index) {
  const context = await browser.newContext();
  contexts.push(context);
  // Permit only the local website and the established Pilot auth/data endpoints.
  await context.route('**/*', (route) => {
    const origin = new URL(route.request().url()).origin;
    if (![base, process.env.SUPABASE_URL].includes(origin))
      throw Error('Unexpected external request in fictional beta check.');
    return route.continue();
  });
  const page = await context.newPage();
  page.on('pageerror', (error) => browserErrors.push(error.message));
  await page.goto(base + '/account.html?mode=signin');
  await page.getByLabel('Email Address').fill(credentials[index].email);
  await page.getByLabel('Password', { exact: true }).fill(credentials[index].password);
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await expect(page.locator('#account-status')).toContainText('Saved Across Devices');
  await page.getByRole('link', { name: 'My Profile', exact: true }).first().click();
  return page;
}
async function verifyProfile(page, profile) {
  await expect(page.getByLabel('Your Name')).toHaveValue(profile.name);
  await expect(page.getByLabel('College or University')).toHaveValue(profile.college);
  await expect(page.getByLabel('Mathematical Interests')).toHaveValue(profile.interests);
}
try {
  for (const [i, api] of clients.entries()) {
    const { data, error } = await api.auth.signInWithPassword({
      email: credentials[i].email,
      password: credentials[i].password,
    });
    if (error) throw Error(error.message);
    users.push(data.user.id);
    originals.push(await loadPlan(api, data.user.id));
    assert.ok(originals[i], 'Existing fictional planning fixture required for reversible testing.');
  }
  await writeFile(
    backup,
    JSON.stringify(originals.map((row, i) => ({ userId: users[i], plan: row.plan }))),
    { mode: 0o600 },
  );
  server = spawn('python3', ['serve.py', '--port', '5244'], {
    cwd: new URL('..', import.meta.url),
    stdio: ['ignore', 'ignore', 'ignore'],
    env: {
      PATH: process.env.PATH,
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY: process.env.SUPABASE_PUBLISHABLE_KEY,
    },
  });
  let ready = false;
  for (let i = 0; i < 40; i++) {
    if (server.exitCode !== null) throw Error('Fictional beta preview server could not start.');
    try {
      ready = (await fetch(base)).ok;
    } catch {
      /* Wait for the local listener. */
    }
    if (ready) break;
    await pause(100);
  }
  assert.ok(ready, 'Fictional beta preview server timed out.');
  browsers.push(await chromium.launch(), await webkit.launch());
  for (let i = 0; i < 2; i++) {
    const page = await signIn(browsers[0], i);
    await page.getByLabel('Your Name').fill(profiles[i].name);
    await page.getByLabel('College or University').fill(profiles[i].college);
    await page.getByLabel('Mathematical Interests').fill(profiles[i].interests);
    await page.getByRole('button', { name: 'Save My Profile' }).click();
    await expect(page.locator('#save-state')).toHaveText('All Changes Saved');
    assert.deepEqual((await loadPlan(clients[i], users[i])).plan.profile, profiles[i]);
    await page.getByRole('button', { name: 'Sign Out', exact: true }).click();
    await expect(
      page.locator('#account-links').getByRole('link', { name: 'Sign In', exact: true }),
    ).toBeVisible();
  }
  // Independent browser engine and new cookie/storage contexts, not a page reload.
  for (let i = 0; i < 2; i++) {
    const fresh = await signIn(browsers[1], i);
    await verifyProfile(fresh, profiles[i]);
    await fresh.getByRole('button', { name: 'Sign Out', exact: true }).click();
    await expect(
      fresh.locator('#account-links').getByRole('link', { name: 'Sign In', exact: true }),
    ).toBeVisible();
  }
  for (const [i, api] of clients.entries()) {
    // Reauthenticate SDK verification sessions after browser sign-out.
    const { error } = await api.auth.signInWithPassword({
      email: credentials[i].email,
      password: credentials[i].password,
    });
    if (error) throw Error(error.message);
    const read = await api
      .from('student_program_plans')
      .select('plan')
      .eq('user_id', users[1 - i]);
    assert.equal(read.error, null);
    assert.deepEqual(read.data, []);
    const update = await api
      .from('student_program_plans')
      .update({ plan: { schemaVersion: 2, profile: profiles[i], saved: {} } })
      .eq('user_id', users[1 - i])
      .select('user_id');
    assert.equal(update.error, null);
    assert.deepEqual(update.data, []);
    const transfer = await api
      .from('student_program_plans')
      .update({ user_id: users[1 - i] })
      .eq('user_id', users[i]);
    assert.ok(transfer.error, 'Clients must not reassign row ownership.');
  }
  const hidden = await anonymous.from('student_program_plans').select('plan');
  assert.ok(hidden.error, 'Anonymous profile access must be denied.');
  for (let i = 0; i < 2; i++)
    assert.deepEqual((await loadPlan(clients[i], users[i])).plan.profile, profiles[i]);
  assert.deepEqual(
    browserErrors,
    [],
    'No browser runtime errors during online profile beta check.',
  );
  console.log(
    'PASS: two fictional online profiles saved through the UI, persisted in Pilot, retrieved in fresh Safari contexts, and isolated from other accounts and anonymous requests.',
  );
} catch (error) {
  console.error('Fictional profile beta check failed:', error.message);
  throw error;
} finally {
  // Close tabs before restoring; do not leave test pages able to resave fixtures.
  await Promise.allSettled(contexts.map((context) => context.close()));
  await Promise.allSettled(browsers.map((browser) => browser.close()));
  if (server) server.kill();
  const restored = await Promise.allSettled(
    originals.map(async (original, i) => {
      if (!original) return;
      const api = clients[i];
      const { error } = await api.auth.signInWithPassword({
        email: credentials[i].email,
        password: credentials[i].password,
      });
      if (error) throw Error(error.message);
      const current = await loadPlan(api, users[i]);
      const restoredPlan = { ...original.plan, schemaVersion: 2 };
      await writePlan(api, users[i], restoredPlan, current.revision);
      assert.deepEqual((await loadPlan(api, users[i])).plan, restoredPlan);
    }),
  );
  await Promise.allSettled(
    [...clients, anonymous].map((api) => api.auth.signOut({ scope: 'local' })),
  );
  for (const result of restored)
    if (result.status === 'rejected')
      console.error('Fictional fixture restore failed:', result.reason.message);
  if (restored.some((result) => result.status === 'rejected'))
    throw Error(
      'Fictional fixture restoration needs attention; the private backup preserves original contents.',
    );
  console.log('PASS: original fictional profiles and saved-plan contents restored.');
}
