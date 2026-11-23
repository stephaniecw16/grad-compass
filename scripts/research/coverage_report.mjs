// Reproduce the field-by-field verification inventory from the shipped catalog.
// A university page retrieval is never counted as verification of every field on it.
import { writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { programs, amsCheckedOn, degreeTrackCount } from '../../src/catalog/catalog.js';
import { fieldLabels, fieldEvidence, verificationSummary } from '../../src/catalog/evidence.js';
const totals = Object.fromEntries(
  fieldLabels.map(([key, label]) => [key, { label, university: 0, ams: 0, unverified: 0 }]),
);
for (const p of programs)
  for (const [key] of fieldLabels) totals[key][fieldEvidence(p, key).status]++;
const manifest = {
  source: 'https://www.ams.org/find-graduate-programs?search=1',
  checkedOn: amsCheckedOn,
  amsListingCount: programs.length,
  degreeTrackCount,
  degreeCounts: Object.fromEntries(
    ['Masters', 'Doctoral', 'Bridge/Postbaccalaureate', 'Certificate'].map((type) => [
      type,
      programs.filter((p) => p.degrees.includes(type)).length,
    ]),
  ),
  sourceDataSha256: createHash('sha256')
    .update(await readFile('src/catalog/ams-data.js'))
    .digest('hex'),
  importedListingIds: programs.map((p) => p.ams.amsId),
  fields: totals,
};
await writeFile('docs/research/ams-manifest.json', JSON.stringify(manifest, null, 2) + '\n');
const escape = (value) => String(value).replaceAll('|', '/').replaceAll('\n', ' ');
const rows = programs.map((p) => {
  const c = verificationSummary(p);
  return `| ${escape(p.name + ' — ' + p.title)} | [${p.ams.amsId}](https://www.ams.org/find-graduate-programs?search=1#school_${p.ams.amsId}) | ${c.university} | ${c.ams} | ${c.unverified} | ${escape(p.ams.updated || 'Not supplied')} |`;
});
const text = `# AMS Field Verification Inventory\n\nAll ${programs.length} AMS listing IDs were imported on ${amsCheckedOn}, covering ${degreeTrackCount} advertised degree options. Duplicate and incomplete records are retained. The original 25 saved IDs are preserved.\n\nThis is an evidence inventory, **not a claim that all fields are independently verified**. University-source counts include older retained research and fresh checks; each UI field shows its own date and scope. AMS data is department-reported, can be stale, and often lacks a census year. Unverified does not mean zero, no waiver, no GRE, or program closure.\n\n## Coverage by Field\n\n| Field | University Source | AMS Reported | Not Verified |\n| --- | ---: | ---: | ---: |\n${Object.values(
  totals,
)
  .map((r) => `| ${r.label} | ${r.university} | ${r.ams} | ${r.unverified} |`)
  .join(
    '\n',
  )}\n\n## Every Listing\n\nCounts below refer to ${fieldLabels.length} comparison fields, not entire programs certified as current. The last column is AMS's listing-update timestamp, not a statistics year.\n\n| Institution / Program | AMS ID | University | AMS | Not Verified | AMS Last Updated |\n| --- | --- | ---: | ---: | ---: | --- |\n${rows.join('\n')}\n`;
await writeFile('docs/AMS-VERIFICATION.md', text);
console.log(
  JSON.stringify({
    listings: programs.length,
    degreeTracks: degreeTrackCount,
    fields: fieldLabels.length,
    recordsWithUniversityFacts: programs.filter((p) => verificationSummary(p).university > 0)
      .length,
    fieldTotals: totals,
  }),
);
