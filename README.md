# GradApp (Student)

**Full AMS Catalog: 742 Listings · 1,295 Advertised Degree Options**

[Previous 25-Program Preview](https://gradapp-3b23d5042-grad-app1.vercel.app/) · The expanded site is being built in its own protected GradApp (Student) Vercel project. The current full-catalog preview link will be recorded after deployment.

A free student website to discover, research, compare, and keep track of mathematics graduate programs. This is the separate student-site repository, independent of [AppHelper](https://github.com/stephaniecw16/apphelper), the application-review project.

The preview is protected and may require Vercel sign-in. Choose **Try the Student Demo** for a fictional browser-local account, or create/sign in to an online student account. Linking this preview does not make it public.

## What It Includes

- All 742 AMS listings in the US and Canada: mathematics and related subjects, including master’s, doctoral, bridge/postbaccalaureate and certificate routes. Citations and field-level source dates remain visible.
- Search, pagination, research-area/region, country and degree filters; side-by-side school comparisons, including fees, fee waivers, GRE policies, funding, teaching, and program size where verified.
- Student account creation/sign-in, account-owned saved programs, research notes, planning profiles, and personal checklists.
- Degree-specific confirmed deadlines, labeled personal planning dates, a sorted timeline, and calendar downloads. A doctoral deadline never silently becomes a master’s deadline.
- Clear save controls, success/error feedback, and a responsive student-only interface.

Students apply through each university's official website. This repository contains no application submission, faculty review, department administration, private transcript uploads, or recommendation-letter collection.

All AMS listing tables were checked **November 23, 2026**. They include department-reported counts, subjects, degree options and raw GRE policies. These are labeled **AMS Reported**, not independently university-verified. Separate AMS IDs are retained even when labels duplicate; incomplete entries are not silently dropped.

**University-source research is available for 90 listings, including the original 25; complete independent verification of every field is not finished.** The other fields are explicitly labeled **Not Verified**. Fresh primary-source checks cover additional fees, waivers, GRE statements and confirmed cycle dates. Original research retains its November 6–13 dates. [The complete field inventory](docs/AMS-VERIFICATION.md) shows coverage for every listing and field.

Never read a blank as zero/no fee waiver/no GRE. AMS listing-update times are not enrollment census years. Tuition is not an application fee; funding duration is not average time to degree. Some university pages conflict or describe historical cycles, which are excluded from automatic dates. Confirm the intended cycle and exact deadline/time zone with each university.

## Preview Locally

```sh
python3 serve.py --port 5173
```

Open [the local website](http://127.0.0.1:5173/). Use the student demo without configuring an online service. To enable online accounts locally, create an ignored `.env.local` from [.env.example](.env.example), using the existing project's URL and browser-safe publishable key. Never add service-role keys, real student files, credentials, or browser exports to Git.

## Check and Build

Use Node 22+ and the pinned pnpm package manager.

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium webkit
pnpm check
pnpm test:planner
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test:e2e
pnpm build
```

Building requires the two browser-safe environment values; output is the allowlisted `dist/` folder. GitHub Actions runs source, model, build, formatting, lint, data-contract, and Chromium/WebKit checks. No private live-account credentials are used in CI.

## Repository Layout

| Folder | Purpose |
| --- | --- |
| `src/planner/` | Accounts, planning records, persistence, directory/comparison rendering, and navigation |
| `src/catalog/` | The 25 sourced real program records and comparison/fee/GRE facts |
| `src/workspaces/` | Compatible browser-local student demo account storage |
| `src/types/` | Student planning data contracts |
| `styles/` | Student website appearance |
| `tests/` | Planning validation and repeatable browser journeys |
| `scripts/` | Build, dependency checks, and Git safeguards |
| `supabase/` | Additive owned-planning schema reference |
| `docs/` | Program sources, development guide, verification, and daily progress |
| `vendor/` | Pinned Supabase browser bundle and third-party licenses |

## Preview Hosting and Project Separation

This repository was extracted from GradApp commit `8f29f6d38c2a147e75a05dd5feb47940dbe29550` on November 23, 2026. It contains the working student-site files and their build/tests, with fresh repository history. Old application code and records remain in the original private [GradApp repository](https://github.com/stephaniecw16/gradapp). AppHelper remains separate and unchanged.

The dedicated `gradapp-student` Vercel project is connected to this private repository, with the existing development account configuration and Vercel sign-in protection. The old GradApp/AppHelper projects remain separate. Public publishing and paid services require the owner’s approval.

Online student planning continues to use the existing development account system and RLS-protected `student_program_plans` table. Do not reapply [the initial schema](supabase/student-plans.sql) to the current project: it is already installed. The additive [expanded-plan guard](supabase/protect-expanded-plans.sql) rejects older clients attempting to downgrade a version-2 plan; existing saved contents and ownership policies are preserved. Real confirmation-email delivery and the final launch-domain redirect configuration remain launch checks.

[Full AMS verification inventory](docs/AMS-VERIFICATION.md) · [Development guide](docs/DEVELOPMENT.md) · [Verification](docs/VERIFICATION.md) · [Daily progress](docs/DAILY-PROGRESS.md) · [Program sources](docs/SOURCES.md) · [Comparison sources](docs/COMPARISON-SOURCES.md) · [Fee sources](docs/FEE-SOURCES.md)

GradApp is independent of AMS, Common App, ETS, and the listed institutions.
