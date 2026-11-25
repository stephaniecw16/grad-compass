# Grad Compass

**[Open Grad Compass — Full AMS Directory Preview](https://gradapp-student.vercel.app/)**

742 AMS Listings · 1,295 Advertised Degree Options

Grad Compass is the student research and planning offshoot of GradApp.

A free student website to discover, research, compare, and keep track of mathematics graduate programs. This is the separate student-site repository, independent of [AppHelper](https://github.com/stephaniecw16/apphelper), the application-review project.

The preview is protected and may require Vercel sign-in. Choose **Try the Student Demo** for a fictional browser-local account, or create/sign in to an online student account. Linking this preview does not make it public.

**No Grad Compass account is required to browse or compare programs, scholarships, or application requirements.** An account is only needed to save personal planning information. The account page includes an explicit guest-browsing path. Vercel sign-in still protects the preview itself; that is separate from a GradApp account.

## What It Includes

- All 742 AMS listings in the US and Canada: mathematics and related subjects, including master’s, doctoral, bridge/postbaccalaureate and certificate routes. Citations and field-level source dates remain visible.
- Search, pagination, research-area/region, country, degree and contact-coverage filters; 30 source-scoped comparison fields, including fees, fee waivers, GRE policies, funding, teaching, program size, first-year enrollment and reported tuition/stipends.
- Department website links for **556 listings**, separate admissions URLs for 455, and usable email/phone contacts for 475. University-published professional emails were independently reviewed for **242 listings**, including **171 with department/program contacts**. Central graduate-school and college offices are labeled separately. Program Details and comparison cells link directly to each source.
- A separate **Scholarships and Fellowships** tab with eight officially sourced opportunities relevant to math, applied math, statistics, data science and CS: NSF GRFP, DOE CSGF, Hertz, NDSEG, PD Soros, Google PhD, CGRS M and CGRS D. Includes eligibility, materials, nomination routes, deadlines and source dates.
- An **Application Requirements** tab for all 742 AMS listings, with degree-specific statement summaries, required/recommended/conditional status, published length guidance and supplemental questions where available. Published guidance covers **49 listings**; full portal-question verification is incomplete. The same guidance appears in Program Details and is reachable from Saved Programs.
- Student account creation/sign-in, account-owned saved programs, research notes, planning profiles, and personal checklists.
- Degree-specific confirmed deadlines, labeled personal planning dates, a sorted timeline, and calendar downloads. A doctoral deadline never silently becomes a master’s deadline.
- Clear save controls, success/error feedback, and a responsive student-only interface.

Students apply through each university's official website. This repository contains no application submission, faculty review, department administration, private transcript uploads, or recommendation-letter collection.

All AMS listing tables were checked **November 23, 2026**. They include department-reported counts, subjects, degree options and raw GRE policies. These are labeled **AMS Reported**, not independently university-verified. Separate AMS IDs are retained even when labels duplicate; incomplete entries are not silently dropped.

**Individual university-source fields now exist for 308 listings; complete independent verification of every field is not finished.** Retained academic/admissions research covers 90 listings, including the original 25; newly reviewed contacts and department links expand individual-field coverage without verifying all other admissions facts. The other fields are explicitly labeled **Not Verified**. Fresh primary-source checks cover additional fees, waivers, GRE statements and confirmed cycle dates. Original research retains its November 6–13 dates. [The complete field inventory](docs/AMS-VERIFICATION.md) shows coverage for every listing and field.

The fresh website/contact pass checked 1,354 deduplicated public URLs, retrieved 1,051, and searched all 258 listings missing both department and admissions links. It added 89 directly checked official department/contact/faculty pages. See [department research coverage](docs/DEPARTMENT-RESEARCH.md) for methods and remaining gaps. Link retrieval alone is not policy verification.

Never read a blank as zero/no fee waiver/no GRE. AMS listing-update times are not enrollment census years. Tuition is not an application fee; funding duration is not average time to degree. Some university pages conflict or describe historical cycles, which are excluded from automatic dates. Confirm the intended cycle and exact deadline/time zone with each university.

See the [funding and writing research inventory](docs/FUNDING-AND-WRITING-RESEARCH.md) for the scope, primary sources, and an explicit status for every AMS listing. Most authenticated application questions cannot be verified from public pages; unknown questions are never presented as absent.

## Beta Testing and Profile Storage

The November 24 beta pass covered the student directory/comparisons, research tabs, local account/plan/profile workflows, deadlines, calendar export, mobile layout and error recovery. **26 Chrome/Safari browser cases and 23 data/model checks passed.** Two reserved fictional online accounts also saved profiles through Chromium and retrieved their distinct private profiles in fresh Safari sessions; cross-account/anonymous access was denied. Fixed retrying sign-in after a temporary account-configuration failure and clarified profile save-location labels.

**Online profile saving is already connected.** Choose **Online Account · Across Devices**, sign in, edit **My Profile**, and press **Save My Profile**. Supabase stores the name, college and interests with the account-owned saved plan. **Local Preview** accounts stay in one browser and do not automatically migrate to an online account. The email belongs to the sign-in account; document uploads and application records are outside this student site.

See the [beta report](docs/BETA-TEST-2026-11-24.md) and [public-launch steps](docs/PUBLIC-LAUNCH.md). Password reset, full data export/deletion, owner-reviewed privacy information and real confirmation-email delivery are launch work. The preview remains protected; public launch and paid services still need approval.

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
| `src/catalog/` | Full AMS listing data, the original 25 overlays, and field-level university/AMS evidence |
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

The dedicated `grad-compass` Vercel project is connected to this private repository, with the existing development account configuration and Vercel sign-in protection. The old GradApp/AppHelper projects remain separate. Public publishing and paid services require the owner’s approval.

Online student planning continues to use the existing development account system and RLS-protected `student_program_plans` table. Do not reapply [the initial schema](supabase/student-plans.sql) to the current project: it is already installed. The additive [expanded-plan guard](supabase/protect-expanded-plans.sql) rejects older clients attempting to downgrade a version-2 plan; existing saved contents and ownership policies are preserved. Real confirmation-email delivery and the final launch-domain redirect configuration remain launch checks.

[Full AMS verification inventory](docs/AMS-VERIFICATION.md) · [Development guide](docs/DEVELOPMENT.md) · [Verification](docs/VERIFICATION.md) · [Daily progress](docs/DAILY-PROGRESS.md) · [Program sources](docs/SOURCES.md) · [Comparison sources](docs/COMPARISON-SOURCES.md) · [Fee sources](docs/FEE-SOURCES.md)

Grad Compass is independent of AMS, Common App, ETS, and the listed institutions.


## Grad Compass Name and Domain

The student site and private repository were renamed to **Grad Compass** / [stephaniecw16/grad-compass](https://github.com/stephaniecw16/grad-compass) on November 24, 2026. The Vercel project is also named `grad-compass`. Its protected preview URL currently remains https://gradapp-student.vercel.app/; changing the preview address is a separate pending step. No custom domain has been purchased or connected. Saved-program IDs, browser storage/session keys, online profile ownership and existing calendar event UIDs are preserved.

[Domain availability and registration/renewal quotes](docs/DOMAIN-OPTIONS.md) were checked with Vercel on November 24. Domain purchase and public launch still require approval. Historical development records and the original GradApp/AppHelper repositories retain their original names.
