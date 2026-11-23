// Rebuild the public coverage inventory from reviewed summaries, not a private cache.
import { writeFile } from 'node:fs/promises';
import { programs } from '../../src/catalog/catalog.js';
import { fellowships, fundingCheckedOn } from '../../src/catalog/fellowships.js';
import {
  writingResearch,
  writingFor,
  writingInvestigations,
} from '../../src/catalog/application-writing.js';
const safe = (value) => String(value).replaceAll('|', '/').replaceAll('\n', ' ');
const covered = programs.filter((p) => writingFor(p).length);
const lines = [
  '# Funding and Application-Writing Research',
  '',
  `Checked November 23, 2026. ${fellowships.length} funding opportunities; ${writingResearch.length} scoped writing entries covering ${covered.length} of ${programs.length} AMS listings.`,
  '',
  '## Research Rules and Limits',
  '',
  '- Funding is restricted to opportunities relevant to mathematics, applied mathematics, data science, statistics, and computer science. Broad STEM awards are included only where these subjects can fit; filters never determine personal eligibility.',
  '- Sponsor eligibility and application requirements are paraphrased, cited and dated. Review full rules for citizenship, prior graduate enrollment, program stage, research area, nomination and award compatibility.',
  '- Use the current NSF FY2027 solicitation (26-526), not superseded FY2026 guidance. The reference deadline precedes the Mathematical Sciences application deadline. Past dates remain labeled closed. Published annual dates without a verified year stay undated.',
  '- Program writing summaries attach to explicit AMS listing IDs and degrees. Separate departments do not inherit one another’s questions. Graduate-school guidance is labeled and separately sourced.',
  '- A required essay, recommended statement, optional document and conditional supplement are distinct. Suggested lengths are not hard cutoffs. Unknown limits remain unknown, never zero or unlimited.',
  '- Supplemental prompts are paraphrases, not exact reproductions. Public checklists rarely expose the full authenticated application. Missing questions are Not Verified, not None. No university application accounts were created and no forms submitted.',
  '- Every original program remains available. Some original 25 listings still have no verified writing prompt. The table below is an exhaustive coverage inventory, not a claim that all 742 applications have been inspected.',
  '- Raw research caches stay outside Git. Existing university-link research covered 463 deduplicated AMS-published URLs (310 retrieved). This pass examined writing-language candidates from those pages and additional primary sources; retrieval alone was not published as verification.',
  '',
  '## Scholarships and Fellowships',
  '',
  ...fellowships.flatMap((f) => [
    `### ${f.name}`,
    '',
    `Scope: ${f.fields.join(', ')}. ${f.cycle}.`,
    '',
    ...f.sources.map(([label, url]) => `- [${label}](${url}) — checked ${fundingCheckedOn}`),
    '',
  ]),
  '## Published Writing Guidance',
  '',
  '| AMS ID / Saved ID | Program | Degrees Covered | Statements and Limits | Official Sources |',
  '| --- | --- | --- | --- | --- |',
  ...writingResearch.flatMap((e) =>
    e.programIds.map((id) => {
      const p = programs.find((p) => p.id === id);
      return `| ${p.ams.amsId} / ${p.id} | ${safe(p.name + ' · ' + p.title)} | ${e.degrees.join(', ')} | ${e.statements.map((s) => safe(s.title + ' — ' + s.requirement + '; ' + (s.length || 'Length not verified'))).join('<br>')} | [Guidance](${e.source})${(e.additionalSources || []).map(([label, url]) => ` · [${label}](${url})`).join('')} |`;
    }),
  ),
  '',
  '## All AMS Listings: Coverage Inventory',
  '',
  'Published means at least one degree has public guidance; it does not certify a complete current application question set. For every other degree, use the explicit unknown state in the website.',
  '',
  '| AMS ID | Institution / Department | Writing Research Status |',
  '| --- | --- | --- |',
  ...programs.map(
    (p) =>
      `| ${p.ams.amsId} | ${safe(p.name + ' · ' + p.title)} | ${writingFor(p).length ? 'Published Guidance: ' + [...new Set(writingFor(p).flatMap((e) => e.degrees))].join(', ') : writingInvestigations[p.id] ? 'Investigated; Prompt Not Verified' : 'Not Verified'} |`,
  ),
  '',
];
await writeFile('docs/FUNDING-AND-WRITING-RESEARCH.md', lines.join('\n'));
console.log(
  `${covered.length} listings with published writing guidance; ${programs.length - covered.length} remain unverified. All ${programs.length} listed in the inventory.`,
);
