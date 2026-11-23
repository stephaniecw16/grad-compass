// Opt-in Pilot verification: uses only the two existing fictional accounts.
// Configuration and credentials are read from ignored operator-provided paths, never copied.
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { createClient } from '../vendor/supabase/client.mjs';
import { loadPlan, writePlan } from '../src/planner/plan-store.js';
import { normalizePlan, newSaved } from '../src/planner/plan-model.js';
import { programs } from '../src/catalog/catalog.js';
assert.ok(
  process.env.GRADAPP_CONFIG_FILE && process.env.GRADAPP_TEST_ACCOUNTS,
  'Provide ignored configuration and fictional-account file paths.',
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
const make = () =>
  createClient(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
const a = make(),
  b = make(),
  fresh = make(),
  originals = [],
  ids = [];
try {
  for (const [i, client] of [a, b].entries()) {
    const auth = await client.auth.signInWithPassword(credentials[i]);
    if (auth.error) throw auth.error;
    ids.push(auth.data.user.id);
    originals.push(await loadPlan(client, ids[i]));
  }
  const next = normalizePlan(originals[0]?.plan, programs);
  next.saved['ams-7906'] = {
    ...newSaved(programs.find((p) => p.id === 'ams-7906')),
    notes: 'Fictional expanded-catalog preservation test',
  };
  let revision = await writePlan(a, ids[0], next, originals[0]?.revision ?? null);
  assert.equal(
    (await loadPlan(a, ids[0])).plan.saved['ams-7906'].notes,
    next.saved['ams-7906'].notes,
  );
  const hidden = await b.from('student_program_plans').select('plan').eq('user_id', ids[0]);
  assert.deepEqual(hidden.data, []);
  const oldClient = { profile: next.profile, saved: {} };
  await assert.rejects(writePlan(a, ids[0], oldClient, revision), /expanded AMS catalog/);
  assert.ok((await loadPlan(a, ids[0])).plan.saved['ams-7906']);
  const auth = await fresh.auth.signInWithPassword(credentials[0]);
  if (auth.error) throw auth.error;
  assert.ok((await loadPlan(fresh, ids[0])).plan.saved['ams-7906']);
  const current = await loadPlan(a, ids[0]);
  await writePlan(a, ids[0], next, current.revision);
  await assert.rejects(writePlan(fresh, ids[0], next, current.revision), /changed in another tab/);
  console.log(
    'PASS: expanded online saves and fresh-client retrieval, two-account isolation, stale-tab rejection, and old-client downgrade protection.',
  );
} finally {
  for (let i = 0; i < originals.length; i++) {
    const client = [a, b][i],
      current = await loadPlan(client, ids[i]);
    if (!current) continue;
    // Contents are restored; retain the v2 marker if the new workflow upgraded the fixture.
    const restored =
      current.plan.schemaVersion === 2
        ? { ...(originals[i]?.plan || { profile: {}, saved: {} }), schemaVersion: 2 }
        : originals[i]?.plan;
    if (restored) await writePlan(client, ids[i], restored, current.revision);
  }
  await Promise.all([a, b, fresh].map((client) => client.auth.signOut()));
}
