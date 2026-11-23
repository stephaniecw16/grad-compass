import test from 'node:test';
import assert from 'node:assert/strict';
import { programs } from '../../src/catalog/catalog.js';
import { fellowships, filterFellowships, deadlineState } from '../../src/catalog/fellowships.js';
import { writingResearch, writingFor, writingStatus } from '../../src/catalog/application-writing.js';
import { fundingCard, writingSummary } from '../../src/planner/research-workspace.js';

const program=id=>programs.find(p=>p.id===id);
test('funding entries have distinct IDs, eligibility, requirements and primary sources',()=>{
  assert.equal(new Set(fellowships.map(f=>f.id)).size,fellowships.length);
  for(const f of fellowships) {
    assert.ok(f.eligibility.length && f.requirements.length && f.sources.length);
    assert.ok(f.fields.every(v=>['Mathematics','Applied Mathematics','Statistics','Data Science','Computer Science'].includes(v)));
    for(const [,url] of f.sources) assert.match(url,/^https:\/\//);
    for(const d of f.deadlines) assert.match(d.date,/^\d{4}-\d{2}-\d{2}$/);
  }
});
test('funding search and combined filters preserve degree-stage and nomination constraints',()=>{
  assert.deepEqual(filterFellowships({query:'CSGF'}).map(f=>f.id),['doe-csgf']);
  assert.ok(filterFellowships({field:'Mathematics',location:'Canada'}).every(f=>f.location==='Canada'));
  assert.equal(filterFellowships({query:'not-a-real-award'}).length,0);
  assert.match(fellowships.find(f=>f.id==='google-phd').eligibility.join(' '),/no direct student applications/);
});
test('closed deadlines stay closed and are not rolled into a future cycle',()=>{
  assert.equal(deadlineState('2026-10-23','2026-11-23'),'Deadline Passed');
  assert.equal(deadlineState('2027-01-07','2026-11-23'),'Published Deadline');
  assert.equal(deadlineState('2026-11-23','2026-11-23'),'Due Today');
  assert.equal(fellowships.find(f=>f.id==='cgrs-m').deadlines.length,0);
  assert.match(fundingCard(fellowships.find(f=>f.id==='nsf-grfp')),/Reference letters/);
});
test('every reviewed writing entry maps to existing IDs and valid advertised degrees',()=>{
  const seen=new Set();
  for(const entry of writingResearch) {
    assert.match(entry.source,/^https?:\/\//);
    assert.equal(entry.checkedOn,'2026-11-23');
    assert.ok(entry.scope && entry.cycle && entry.supplementalStatus);
    for(const id of entry.programIds) {
      const p=program(id);assert.ok(p,`Unknown ID ${id}`);
      for(const degree of entry.degrees) {
        assert.ok(p.degrees.includes(degree),`${id} does not advertise ${degree}`);
        const key=id+'|'+degree;assert.ok(!seen.has(key),`Overlapping requirements: ${key}`);seen.add(key);
      }
    }
    for(const item of [...entry.statements,...entry.supplementals]) assert.ok(item.title && item.summary && item.requirement);
  }
});
test('separate departments and degree tracks do not inherit each other’s statements',()=>{
  assert.equal(writingFor(program('boise'),'Masters').length,0);
  assert.equal(writingFor(program('ams-8554'),'Doctoral').length,0);
  assert.equal(writingFor(program('cornell-applied')).length,0);
  assert.equal(writingFor(program('clarkson'),'Masters')[0].source.includes('mathematics-ms'),true);
  assert.equal(writingFor(program('clarkson'),'Doctoral')[0].source.includes('mathematics-phd'),true);
});
test('unknown supplemental questions and length limits never become none or zero',()=>{
  assert.equal(writingStatus(program('baylor')),'Not Verified');
  assert.match(writingSummary(program('baylor')),/Not Verified/);
  assert.match(writingSummary(program('ams-6202')),/Not Published \/ Not Verified/);
  assert.match(writingSummary(program('brown-math')),/video/i);
  assert.match(writingSummary(program('boise')),/Potential Faculty Advisors/);
  assert.match(writingSummary(program('ams-6270')),/1–2 paragraphs/);
  assert.match(writingSummary(program('ams-8566')),/2 and 4 pages/);
});
test('external research text is escaped before rendering',()=>{
  const f={...fellowships[0],name:'<img src=x onerror=alert(1)>',requirements:['<script>test</script>']};
  const rendered=fundingCard(f);assert.ok(!rendered.includes('<img'));assert.ok(!rendered.includes('<script>'));
  assert.match(rendered,/&lt;img/);
});
