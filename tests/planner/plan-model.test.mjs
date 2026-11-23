import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { programs } from '../../src/catalog/data.js';
import {
  normalizePlan,
  dateOnly,
  effectiveDeadline,
  calendarFile,
} from '../../src/planner/plan-model.js';
test('only the 25 real catalog programs can enter the saved plan', () => {
  assert.equal(programs.length, 25);
  const plan = normalizePlan(
    {
      saved: {
        auburn: {
          notes: 'x'.repeat(7000),
          stage: 'Submitted',
          deadline: '2027-02-30',
          tasks: { research: true, unknown: true },
        },
        'example-test-university-math': {},
      },
    },
    programs,
  );
  assert.deepEqual(Object.keys(plan.saved), ['auburn']);
  assert.equal(plan.saved.auburn.notes.length, 5000);
  assert.equal(plan.saved.auburn.stage, 'Researching');
  assert.equal(plan.saved.auburn.deadline, '');
  assert.equal(plan.saved.auburn.tasks.research, true);
  assert.equal(plan.saved.auburn.tasks.unknown, undefined);
});
test('uncertain dates stay undated; personal dates override confirmed dates', () => {
  assert.equal(dateOnly('2027-02-29'), '');
  assert.equal(dateOnly('2028-02-29'), '2028-02-29');
  assert.equal(effectiveDeadline({ deadline: null }, {}), '');
  assert.equal(
    effectiveDeadline({ deadline: '2026-12-15' }, { deadline: '2027-01-06' }),
    '2027-01-06',
  );
});
test('calendar events escape text, fold unicode lines, and use exclusive all-day end dates', () => {
  const calendar = calendarFile([
    {
      program: { id: 'test', name: 'Fictional, School; ' + 'γ'.repeat(80), title: 'Math\nPhD' },
      date: '2026-12-31',
    },
    { program: { id: 'unknown' }, date: '' },
  ]);
  assert.match(calendar, /DTSTART;VALUE=DATE:20261231/);
  assert.match(calendar, /DTEND;VALUE=DATE:20270101/);
  assert.match(calendar, /SUMMARY:Fictional\\, School\\;/);
  assert.equal((calendar.match(/BEGIN:VEVENT/g) || []).length, 1);
  assert.ok(calendar.split('\r\n').every((line) => Buffer.byteLength(line) <= 75));
});
test('hosted planner excludes application, staff, recommendation and private data modules', async () => {
  const manifest = JSON.parse(await readFile('config/public-assets.json', 'utf8'));
  for (const file of manifest)
    assert.doesNotMatch(
      file,
      /^(src\/(application|professor|department|profile|recommendations|cloud)\/|demo-files\/|private\/)/,
    );
  assert.ok(manifest.includes('src/planner/planner.js'));
  assert.ok(!manifest.includes('src/app.js'));
});
