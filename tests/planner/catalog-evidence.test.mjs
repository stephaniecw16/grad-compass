import { test } from 'node:test';
import assert from 'node:assert/strict';
import { programs, degreeTrackCount, curatedAmsIds } from '../../src/catalog/catalog.js';
import { amsListings } from '../../src/catalog/ams-data.js';
import { fieldEvidence, fieldLabels } from '../../src/catalog/evidence.js';
import { effectiveDeadline, normalizePlan } from '../../src/planner/plan-model.js';
import { grePolicy } from '../../src/catalog/gre-policies.js';

test('all 742 AMS IDs and all 1295 degree tracks are preserved, including duplicate departments', () => {
  assert.equal(programs.length, 742);
  assert.equal(degreeTrackCount, 1295);
  assert.equal(new Set(programs.map((p) => p.ams.amsId)).size, 742);
  assert.equal(new Set(programs.map((p) => p.id)).size, 742);
  assert.deepEqual(
    new Set(programs.map((p) => p.ams.amsId)),
    new Set(amsListings.map((p) => p.amsId)),
  );
  for (const id of Object.keys(curatedAmsIds))
    assert.equal(programs.filter((p) => p.id === id).length, 1);
  assert.equal(programs.filter((p) => p.name === 'Brown University').length, 4);
});
test('every comparison field has source-scoped evidence or an explicit unknown', () => {
  for (const p of programs)
    for (const [key] of fieldLabels) {
      const e = fieldEvidence(p, key);
      assert.ok(e.value);
      assert.ok(['ams', 'university', 'unverified'].includes(e.status));
      if (e.status === 'unverified' && !e.source) {
        assert.equal(e.source, null);
        assert.equal(e.checkedOn, null);
      } else {
        assert.match(e.source, /^https?:\/\//);
        assert.match(e.checkedOn, /^\d{4}-\d{2}-\d{2}$/);
        assert.ok(e.scope);
      }
    }
});
test('missing GRE, application fees, average graduation time, and teaching load are never inferred from AMS', () => {
  const p = programs.find((p) => p.id === 'ams-6201');
  assert.equal(grePolicy(p).greGeneral, 'unknown');
  for (const key of [
    'greGeneral',
    'greMath',
    'feeDomestic',
    'feeInternational',
    'waiver',
    'average',
    'timeline',
    'teaching',
  ])
    assert.equal(fieldEvidence(p, key).status, 'unverified');
  assert.equal(fieldEvidence(p, 'faculty').status, 'ams');
});
test('source conflict correction preserves the original AMS location and cites the university', () => {
  const p = programs.find((p) => p.ams.amsId === '7906');
  assert.match(p.ams.location, /Alberta/);
  assert.match(p.city, /Nova Scotia/);
  assert.equal(fieldEvidence(p, 'location').status, 'university');
});
test('doctoral deadlines do not leak into masters plans; original saved IDs retain doctoral defaults', () => {
  const p = programs.find((p) => p.id === 'ams-6270');
  assert.equal(effectiveDeadline(p, { degree: 'Doctoral' }), '2026-12-01');
  assert.equal(effectiveDeadline(p, { degree: 'Masters' }), '');
  assert.equal(effectiveDeadline(p, { degree: 'Masters', deadline: '2027-03-01' }), '2027-03-01');
  const plan = normalizePlan({ saved: { 'brown-math': { notes: 'Existing note' } } }, programs);
  assert.equal(plan.saved['brown-math'].degree, 'Doctoral');
  assert.equal(plan.saved['brown-math'].notes, 'Existing note');
  const mit = programs.find((p) => p.ams.amsId === '2799');
  assert.equal(effectiveDeadline(mit, { degree: 'Doctoral' }), ''); // Annual date lacks an explicit cycle year.
});

test('malformed relative URLs and email-like URL credentials are never exposed as university links', () => {
  for (const p of programs)
    for (const url of [p.ams.website, p.ams.departmentWebsite].filter(Boolean)) {
      const parsed = new URL(url);
      assert.equal(parsed.username, '');
      assert.equal(parsed.password, '');
      assert.ok(!parsed.hostname.endsWith('ams.org'));
    }
});

test('current multi-degree dates and the version-2 plan marker survive normalization', () => {
  const uw = programs.find((p) => p.ams.amsId === '767');
  assert.equal(effectiveDeadline(uw, { degree: 'Masters' }), '2027-03-01');
  assert.equal(effectiveDeadline(uw, { degree: 'Doctoral' }), '2026-12-09');
  const p = normalizePlan(
    { saved: { 'ams-767': { degree: 'Masters', notes: 'Fictional master’s plan' } } },
    programs,
  );
  assert.equal(p.schemaVersion, 2);
  assert.equal(p.saved['ams-767'].degree, 'Masters');
  assert.equal(
    fieldEvidence(
      programs.find((p) => p.ams.amsId === '6277'),
      'deadline',
    ).status,
    'unverified',
  );
});
