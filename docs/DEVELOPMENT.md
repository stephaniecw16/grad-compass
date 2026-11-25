# Development Guide

This is Grad Compass, the standalone student website (formerly GradApp Student), extracted from the verified student-planner version in the original GradApp repository. The active modules, catalog, styles and tests are unchanged in behavior. Legacy portal source, real user files and secrets were not copied.

Use the commands in [README](../README.md). Playwright runs six fictional journeys in both Chromium and WebKit: public research/comparison; signup and plan/profile/checklist/deadline persistence; separate local accounts and repeat sign-in; visitor-to-demo continuation and retired routes; mobile width and unsaved changes. External requests are refused in this suite.

`pnpm check` verifies browser/Node syntax, local references, and the hosted dependency allowlist. `pnpm test:planner` validates dates, bounded saved records, calendar export, and the absence of portal modules from the build. ESLint and Prettier cover maintained source. TypeScript checks the independent student planning data contracts; runtime normalization validates actual records.

The exact-version pnpm build-script approval for esbuild is retained. Keep the pinned package manager, dependency versions, lockfile and vendored license notices together when upgrading. No framework migration is included.

Online plans reuse the existing Supabase development project. Its account-owned RLS table has three ownership policies, restricted column grants, server-generated revisions and stale-save conflict handling. Browser-local preview accounts cannot authorize database access. Email confirmation remains enabled. The original source version was checked with two fictional online users through the interface and database; this repository extraction does not create new real accounts or change backend permissions.

The separate Vercel project uses the established configuration; for a new developer setup, use the existing static settings in vercel.json: build with pnpm build and serve dist. Add only SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY to its environment, keep deployment protection enabled, and verify its confirmation redirect URLs before inviting testers. The expanded catalog uses a separate protected `grad-compass` Vercel project linked to this repository. No public deployment or paid service is authorized by the repository extraction.

## Full Catalog and Provenance

`src/catalog/ams-data.js` is generated from a public DOM table capture using `scripts/research/import_ams.py`. It contains all 742 source IDs and 1,295 advertised degree tracks. The original 25 curated records remain as reference overlays in `data.js`; `catalog.js` joins them through an explicit AMS-ID map, preserving saved IDs. Duplicate department labels never imply automatic merging.

`evidence.js` resolves each comparison field into value, status, source, check date and scope. Its unknown path is explicit. University overrides carry primary citations; generic GRE statements remain overall policies rather than guessed general/subject rules. Master’s/doctoral statistics and dates remain distinct. The generated coverage manifest and inventory can be reproduced with `node scripts/research/coverage_report.mjs`.

Research cache texts and raw captures stay outside Git. The link audit honors robots.txt, deduplicates hosts/URLs and keeps certificate verification enabled. On a Mac Python installation missing its CA bundle, the existing OS bundle can be selected with `SSL_CERT_FILE=/etc/ssl/cert.pem`; never disable verification. A successful retrieval is not proof of a field. The two publication scripts use explicit reviewed facts and a snapshot checksum, refusing a different candidate file until it is reviewed again.

Planning schema version 2 adds degree selection. `protect-expanded-plans.sql`, applied to Pilot, stops an old 25-program preview from dropping new saved program IDs during a downgrade save. Original data is not deleted. `scripts/test_catalog_cloud.mjs` is an opt-in verification using external ignored config/fictional-account paths; it checks expanded persistence, two-account isolation, stale saves and downgrade rejection, then restores fixture contents.

TypeScript covers student data contracts; model tests cover catalog completeness, source/unknown invariants, malformed URL rejection, preserved IDs and degree-specific dates. The 24-card pagination limit is presentation only; all 742 entries remain searchable and savable.

Deployment protection must use `ssoProtection.deploymentType = "all"` for the student project. The earlier all-except-production-alias default did not protect the stable main URL. Verify the stable alias with a request that has no cookies or authorization; it must redirect to Vercel sign-in, not serve the catalog. Keep this separate from normal signed-in browser verification.


## Department Evidence Pipeline

- `import_department_contacts.py` builds factual AMS URL/email/phone records and explicit reviewed university-contact associations. Free-text paragraphs remain outside Git. Degree/program roles, college offices and central graduate-school contacts stay distinct.
- `audit_department_pages.py` checks explicit source URLs plus one relevant public contact anchor per page, with verified TLS, robots rules, bounded reads, deduplication and per-host throttling. Private cache directories are operator arguments. Malformed source anchors are skipped and checkpoints can resume interrupted work.
- `publish_department_audit.py` publishes factual retrieval outcomes and only conservative, unique, explicitly labeled university department anchors. `publish_department_websites.py` accepts explicit human review choices and requires retrieval before publishing a new official page; search snippets alone are excluded.
- `department-info.js` joins the evidence by current AMS ID. `department-view.js` handles safe links, role labels and source dates. `department_report.mjs` and `coverage_report.mjs` reproduce public coverage inventories after formatting generated reviewed data.
- Current AMS replacements 719→9040, 6460→8663 and 6215→8520 have explicit saved-ID aliases in `catalog.js`. Do not replace saved IDs or merge other duplicate departments by name.


## Branding Compatibility

The approved repository is now `stephaniecw16/grad-compass`; the Git safety helper and local origin must use that remote. The protected Vercel project is now named `grad-compass` (same project ID). Its existing `gradapp-student.vercel.app` preview address remains attached; a separate address change awaits approval, so authentication redirects and browser storage origins remain unchanged. Keep `gradapp.*` browser keys and the `@gradapp.planner` calendar UID suffix; these are compatibility identifiers, not product labels.
