# Development Guide

This is the standalone GradApp (Student) website, extracted from the verified student-planner version in the original GradApp repository. The active modules, catalog, styles and tests are unchanged in behavior. Legacy portal source, real user files and secrets were not copied.

Use the commands in [README](../README.md). Playwright runs five fictional journeys in both Chromium and WebKit: public research/comparison; signup and plan/profile/checklist/deadline persistence; separate local accounts and repeat sign-in; visitor-to-demo continuation and retired routes; mobile width and unsaved changes. External requests are refused in this suite.

`pnpm check` verifies browser/Node syntax, local references, and the hosted dependency allowlist. `pnpm test:planner` validates dates, bounded saved records, calendar export, and the absence of portal modules from the build. ESLint and Prettier cover maintained source. TypeScript checks the independent student planning data contracts; runtime normalization validates actual records.

The exact-version pnpm build-script approval for esbuild is retained. Keep the pinned package manager, dependency versions, lockfile and vendored license notices together when upgrading. No framework migration is included.

Online plans reuse the existing Supabase development project. Its account-owned RLS table has three ownership policies, restricted column grants, server-generated revisions and stale-save conflict handling. Browser-local preview accounts cannot authorize database access. Email confirmation remains enabled. The original source version was checked with two fictional online users through the interface and database; this repository extraction does not create new real accounts or change backend permissions.

For a future separate Vercel project, use the existing static settings in vercel.json: build with pnpm build and serve dist. Add only SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY to its environment, keep deployment protection enabled, and verify its confirmation redirect URLs before inviting testers. The README's current preview still belongs to the original Vercel project. No public deployment or paid service is authorized by the repository extraction.
