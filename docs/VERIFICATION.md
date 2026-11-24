# Verification

## Full AMS Directory · November 23, 2026

- Snapshot completeness: all 742 unique AMS IDs; 1,295 degree tracks; all 25 original saved IDs preserved. Duplicated departments remain separate listings.
- Every comparison slot has a source-scoped university or AMS fact, or an explicit unknown. Coverage is available in [AMS-VERIFICATION.md](AMS-VERIFICATION.md); this is not a claim of complete independent university verification.
- Tests verify missing GRE/fees/waivers do not become “None”/zero, uncertain annual dates remain undated, degree-specific dates do not leak between master’s and doctoral plans, and malformed university URLs are excluded.
- Twelve Chromium/WebKit journeys cover the existing student workflow plus full-directory counts, pagination, degree/country filters, source badges and last-alphabetical listings. All 12 browser cases passed in the completed local run. Twelve catalog/model/deployment-boundary checks also passed, together with source syntax, lint, formatting, type contracts and the static build. Seven Git safeguard tests passed.
- The old-client overwrite guard is tested on the two reserved fictional Pilot accounts, with fixture contents restored. No real students are provisioned or emailed.

## Standalone Repository Extraction · November 23, 2026

The student site was copied from original GradApp commit 8f29f6d, keeping the same browser workflows and catalog. The independent build, source/model checks, lint, formatting, data-contract checks, and all 10 Chromium/WebKit journeys passed before upload; GitHub Actions repeats the source/model/build/format/lint/type-contract and browser checks without live credentials.

The five browser journeys exercise all 25 program cards, search and comparison, source-linked details, local student signup/login, isolated shortlists, profile/notes/checklist/deadline persistence, calendar downloads, visitor continuation, retired portal routes, mobile width and unsaved-change warnings. Each runs in Chromium and WebKit. Four model/deployment-boundary checks cover normalization, date uncertainty, calendar escaping/folding and portal exclusion.

The source version's live development verification used two reserved fictional accounts: browser → Supabase → account-owned record → reload/fresh browser. Both isolation and stale-save rejection passed; original fixture contents were restored. No new live accounts or permissions are created by this repository extraction.

The existing protected preview is linked in GitHub and README. New-repository pushes are not yet connected to independent Vercel deployment. Email confirmation delivery, launch-domain redirect configuration, and refreshed university facts remain launch checks. Public publication is not part of this task.

The live expanded-plan test passed for save/retrieve, a fresh client, two-account isolation, stale-tab rejection and old-client downgrade protection. Fixture contents were restored, retaining only the schema-version marker where upgraded. RLS and all three ownership policies remain enabled. Existing backend advisor findings remain outside this catalog task: [pg_net schema placement](https://supabase.com/docs/guides/database/database-linter?lint=0014_extension_in_public) and [leaked-password protection](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection); no paid option was enabled.

Hosted verification: the dedicated GradApp (Student) build is ready at https://gradapp-student.vercel.app/ . It serves all 742 listings, with Vercel sign-in protection on all URLs. The initial all-except-production-alias policy briefly left the main URL public; an anonymous check caught this, the policy was changed to all URLs, and a fresh request returned a 302 redirect to Vercel SSO. No private student files are in the build, and database ownership rules were unchanged. The hosted review also caught AMS free-text instructions in the subject list; filters were restricted to structured topic categories and a regression check was added. The GitHub About website field now points to the full-directory site.


## November 23, 2026 — Funding and Writing Research

- Added eight funding records from sponsor sources and 44 program/degree writing entries covering 49 distinct AMS IDs. Primary URLs, research dates, degree scope, required/recommended/conditional states and uncertain limits are retained. The full 742-listing writing inventory is in FUNDING-AND-WRITING-RESEARCH.md.
- All 19 model/catalog/research tests passed: stable IDs, valid advertised degrees, no overlapping degree entries, separate MS/PhD guidance, no cross-department prompt propagation, source completeness, unknown preservation, safe text rendering, and closed-cycle deadline behavior.
- All 16 Chromium/WebKit browser journeys passed, including funding search/empty states, official links, reference deadlines, scoped writing filters, saved-program navigation and the existing applicant planning workflows. External requests are blocked in these browser tests.
- Source/dependency checks, ESLint, TypeScript contracts, formatting, static build and seven Git-safeguard tests passed. Browser tests required permission to start the local preview; the initial restricted launch failed before any tests ran.
- Existing student plans, storage schema, account permissions and cloud functions were not changed. No live student accounts or application portals were accessed; no forms, emails or applications were submitted. No paid services were added.
- Research remains incomplete: 693 AMS listings have no published writing guidance in this dataset, and even reviewed public pages may omit authenticated supplemental questions. Published guidance must not be described as a fully verified current application.


## November 23, 2026 — No-Account Browsing and Comparison

- Confirmed that public directory, comparison, funding and writing research routes require no GradApp account. Personal saves remain account-owned.
- Added clear guest entry links above the account form and no-account messaging on both planner entry pages. Kept the fictional account demo optional.
- All 18 Chromium/WebKit browser cases passed, including fresh-visitor comparison after the account configuration endpoint returns HTTP 503. All 19 model/research cases, syntax/dependency checks, lint, formatting, type contracts and static build passed.
- No authentication permission, database, billing or Vercel protection settings changed. Vercel preview sign-in is separate from a GradApp account.

## November 23, 2026 — Department Websites and Contacts

- Fresh AMS reconciliation retains 742 unique current source IDs, 1,295 degree tracks and every saved program ID. Regression tests preserve notes and selected degrees for the three explicit AMS ID replacements.
- All 23 model/catalog/research tests passed, including complete contact-record coverage, explicit source-to-program associations, deduplicated emails, office-role scope, primary URL safety, unknown preservation and degree-specific reported amounts.
- All 20 Chromium/WebKit browser journeys passed with external requests blocked. The new journey checks guest contact filtering, sourced department details, email links and contact comparison. Local visual review confirmed the Department Websites and Contacts section and source badges.
- Source/dependency checks, ESLint, formatting, TypeScript contracts and Python syntax checks passed. Static build passed with the reserved fictional browser-safe configuration; the first build correctly refused missing configuration. Existing hosted account configuration and database permissions were not changed.
- Research checked 1,354 unique URLs and retrieved 1,051; all 258 listings missing both AMS website fields received a search pass. Published 89 newly reviewed official pages and 283 university-published professional email records. Retrieval/search coverage is never treated as full academic-policy verification. Coverage and hashes are recorded in research/department-manifest.json.
- Initial local browser launches were blocked before tests started; the permitted local-server runs passed. Contact sources were read only: no email, form, application or portal submission was made. No raw page text, student data or credentials are published.
