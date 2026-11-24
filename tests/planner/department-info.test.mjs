import { test } from 'node:test';
import assert from 'node:assert/strict';
import { programs, previousAmsIds } from '../../src/catalog/catalog.js';
import { amsDepartmentDirectory } from '../../src/catalog/department-data.js';
import { reviewedDepartmentContacts } from '../../src/catalog/department-research.js';
import { departmentInfo, departmentEvidence, linkCheckText } from '../../src/catalog/department-info.js';
import { contactSummary } from '../../src/planner/department-view.js';
import { normalizePlan } from '../../src/planner/plan-model.js';

test('every current AMS listing has a contact record and only explicit official source associations', () => {
  const ids = new Set(programs.map(p => p.ams.amsId));
  assert.deepEqual(new Set(Object.keys(amsDepartmentDirectory)), ids);
  for (const c of reviewedDepartmentContacts) {
    assert.match(c.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    assert.ok(['department', 'program', 'college', 'graduate-school'].includes(c.kind));
    assert.match(c.source, /^https?:\/\//);
    assert.equal(c.checkedOn, '2026-11-23');
    assert.ok(c.label && c.programAmsIds.length);
    for (const id of c.programAmsIds) assert.ok(ids.has(id));
  }
  for (const p of programs) {
    const info = departmentInfo(p);
    assert.equal(new Set(info.contacts.map(c => c.email.toLowerCase())).size, info.contacts.length);
    for (const c of info.contacts.filter(c => c.status === 'university'))
      assert.ok(reviewedDepartmentContacts.some(r => r.email === c.email && r.source === c.source && r.programAmsIds.includes(p.ams.amsId)));
  }
});
test('replaced AMS source IDs preserve saved programs, notes, and selected degrees', () => {
  for (const [current, old] of Object.entries(previousAmsIds)) {
    const p = programs.find(p => p.ams.amsId === current);
    assert.equal(p.id, 'ams-' + old);
    const plan = normalizePlan({ saved: { [p.id]: { degree: p.degrees[0], notes: 'Fictional retained note' } } }, programs);
    assert.equal(plan.saved[p.id].notes, 'Fictional retained note');
    assert.equal(plan.saved[p.id].degree, p.degrees[0]);
  }
});
test('central office contacts keep their scope, unknowns stay unknown, and failed links do not imply closure', () => {
  const central = programs.find(p => departmentInfo(p).contacts.some(c => c.kind === 'graduate-school'));
  assert.match(contactSummary(central), /Central Graduate-School Office/);
  const missing = programs.find(p => !departmentInfo(p).contacts.length && !departmentInfo(p).phones.length);
  assert.equal(departmentEvidence(missing, 'departmentContacts'), null);
  assert.match(contactSummary(missing), /No departmental email|No usable email/);
  assert.match(linkCheckText({ outcome: 'not-retrieved', checkedOn: '2026-11-23' }), /may still open/);
  const amsOnly = programs.find(p => departmentInfo(p).contacts.some(c => c.status === 'ams'));
  assert.match(contactSummary(amsOnly), /Role Not Independently Verified/);
  assert.match(contactSummary(amsOnly), /Contact Source/);
});

test('reviewed department URLs remain explicit primary sources and AMS amounts keep their uncertainty', async () => {
  const { reviewedDepartmentWebsites } = await import('../../src/catalog/department-websites.js');
  const { fieldEvidence } = await import('../../src/catalog/evidence.js');
  for (const [id, entry] of Object.entries(reviewedDepartmentWebsites)) {
    assert.ok(programs.some(p => p.ams.amsId === id));
    assert.equal(entry.source, entry.url);
    const url = new URL(entry.url);
    assert.match(url.hostname, /\.(edu|ca)$/);
    assert.equal(url.username, '');
    assert.equal(url.password, '');
    assert.match(entry.scope, /not current degree availability/);
  }
  for (const key of ['firstYear', 'tuitionReported', 'stipendReported', 'training']) {
    const p = programs.find(p => fieldEvidence(p, key).status === 'ams');
    assert.ok(p, key + ' has reported data');
    const field = fieldEvidence(p, key);
    assert.match(field.source, /ams\.org/);
    assert.match(field.value, /Masters:|Doctoral:|Certificate:|Bridge\/Postbaccalaureate:/);
    if (key.endsWith('Reported')) assert.match(field.scope, /not independently verified/);
    if (key === 'firstYear') assert.match(field.scope, /Reporting year not supplied/);
  }
});
