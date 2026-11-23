# Verification

## Standalone Repository Extraction · November 23, 2026

The student site was copied from original GradApp commit 8f29f6d, keeping the same browser workflows and catalog. The independent build, source/model checks, lint, formatting, data-contract checks, and all 10 Chromium/WebKit journeys passed before upload; GitHub Actions repeats the source/model/build/format/lint/type-contract and browser checks without live credentials.

The five browser journeys exercise all 25 program cards, search and comparison, source-linked details, local student signup/login, isolated shortlists, profile/notes/checklist/deadline persistence, calendar downloads, visitor continuation, retired portal routes, mobile width and unsaved-change warnings. Each runs in Chromium and WebKit. Four model/deployment-boundary checks cover normalization, date uncertainty, calendar escaping/folding and portal exclusion.

The source version's live development verification used two reserved fictional accounts: browser → Supabase → account-owned record → reload/fresh browser. Both isolation and stale-save rejection passed; original fixture contents were restored. No new live accounts or permissions are created by this repository extraction.

The existing protected preview is linked in GitHub and README. New-repository pushes are not yet connected to independent Vercel deployment. Email confirmation delivery, launch-domain redirect configuration, and refreshed university facts remain launch checks. Public publication is not part of this task.
