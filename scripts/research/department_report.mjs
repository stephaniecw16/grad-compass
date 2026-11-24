// Report coverage without turning a retrieved web page into academic verification.
import { writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { programs } from '../../src/catalog/catalog.js';
import { contactCoverage } from '../../src/catalog/department-info.js';
import { reviewedDepartmentContacts } from '../../src/catalog/department-research.js';
import { reviewedDepartmentWebsites } from '../../src/catalog/department-websites.js';
const coverage = contactCoverage(programs);
const links = JSON.parse(await readFile('docs/research/department-link-audit.json', 'utf8'));
const searches = JSON.parse(
  await readFile('docs/research/missing-department-link-search.json', 'utf8'),
);
const hashes = {};
for (const name of [
  'department-data',
  'department-research',
  'department-link-checks',
  'department-websites',
])
  hashes[name] = createHash('sha256')
    .update(await readFile('src/catalog/' + name + '.js'))
    .digest('hex');
await writeFile(
  'docs/research/department-manifest.json',
  JSON.stringify(
    {
      checkedOn: '2026-11-23',
      ...coverage,
      reviewedContactRecords: reviewedDepartmentContacts.length,
      additionalReviewedDepartmentWebsites: Object.keys(reviewedDepartmentWebsites).length,
      missingLinkSearches: searches.length,
      checkedUrls: links.checkedUrls,
      retrievedUrls: links.retrieved,
      sourceDataSha256: hashes,
      scope:
        'Coverage of individual sourced links and contacts, not fully verified programs. University contacts include separately labeled college and central graduate-school offices.',
    },
    null,
    2,
  ) + '\n',
);
await writeFile(
  'docs/DEPARTMENT-RESEARCH.md',
  `# Department Websites and Contacts

Checked November 23, 2026. All **${coverage.listings} AMS listings** have an explicit link/contact research state. This is field coverage, **not a claim that every program is fully verified or currently accepting applications**.

| Coverage | Listings |
| --- | ---: |
| Department website available (AMS or reviewed university source) | ${coverage.departmentWebsites} |
| Separate AMS prospective/admissions URL | ${coverage.admissionsWebsites} |
| AMS listing contains contact notes | ${coverage.listedContacts} |
| Usable email or phone available | ${coverage.usableContacts} |
| At least one independently reviewed university-published email | ${coverage.universityContacts} |
| Department/program email independently reviewed | ${coverage.departmentContacts} |

There are ${reviewedDepartmentContacts.length} reviewed professional contact records. Central graduate-school and college offices are labeled separately from department/program contacts. An AMS-only contact remains **AMS Reported**, with its role marked as not independently verified. Addresses were read from public sources; deliverability was not tested and no messages were sent.

## Research Method and Limits

- Refreshed all 742 AMS listings and 1,295 degree tracks. Extracted factual university links, public emails and non-fax phone numbers; did not republish contact paragraphs.
- Checked ${links.checkedUrls} deduplicated public URLs and retrieved ${links.retrieved}. A working URL does not verify the page's admissions rules. Failed retrieval does not imply closure or that a browser cannot open the page.
- Searched each of the ${searches.length} listings with neither a usable department nor admissions URL in AMS. Added ${Object.keys(reviewedDepartmentWebsites).length} directly retrieved, reviewed official department/contact/faculty pages. Unreviewed search hits and third-party pages are excluded. An empty result means no reviewed link added, not no department website exists.
- Existing academic policy research covers 90 listings. Newly sourced contacts and URLs increase individual-field coverage without claiming all fees, GRE rules, deadlines, teaching loads or graduation statistics have been checked.
- Added clearly labeled, degree-specific AMS first-year enrollment, reported tuition/fees, stipend/salary and structured training resources. Missing currency, billing period, census year and guarantee terms remain unknown. Tuition never becomes an application fee.
- AMS replaced three IDs between snapshots: 719 → 9040 (CSU Northridge Mathematics), 6460 → 8663 (Loyola Chicago Mathematics and Statistics), 6215 → 8520 (Buffalo Biostatistics). Explicit reviewed aliases preserve existing saved IDs, notes and selected degrees.

## Where to Find the Evidence

Open **Program Details → Department Websites and Contacts**, or add schools to **Compare Schools**. The directory has a direct Department Website link and a Contact Information filter. Every contact has its source and date. Browsing and comparison require no GradApp account.

[All-field inventory](AMS-VERIFICATION.md) · [Coverage manifest](research/department-manifest.json) · [URL retrieval audit](research/department-link-audit.json) · [Missing-link search inventory](research/missing-department-link-search.json)

## Reproducing the Reports

Run the department_report.mjs and coverage_report.mjs scripts after reviewed data changes. Import/research tools accept operator-provided private capture/cache paths; source texts, raw search snippets and browser exports stay outside Git. Only explicit review decisions and bounded factual fields reach the site. See [the development guide](DEVELOPMENT.md).
`,
);
console.log(JSON.stringify(coverage));
