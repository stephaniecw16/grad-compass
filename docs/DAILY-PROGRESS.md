# Daily Progress

## November 23, 2026 — Separate GradApp (Student) Repository

- Created the private gradapp-student repository, independent of the original GradApp and AppHelper repositories.
- Labeled the README and repository description GradApp (Student), and added the existing protected website preview to the README and GitHub About website field.
- Copied only the working student website, 25 sourced program records, build configuration, licenses, planning schema reference, and relevant tests/tools. Left application/reviewer/department code, admissions records and private files in their original locations.
- Added standalone source/dependency checks, planning data contracts, student-focused documentation and GitHub Actions. Retained existing student workflows and browser storage compatibility.
- Standalone build, source/model checks, lint, formatting, type-contract checks, and all 10 browser journeys passed.
- The preview remains protected and hosted by the original Vercel project. Automatic deployment from this new repository is not yet connected. No new paid service, public release, or backend change was made.

## November 22–23, 2026 — Student Planner Source Version

- Rebuilt GradApp around the 25 real programs, public search/comparison, student accounts, private shortlists and research notes, planning profiles/checklists and deadline/calendar tools.
- Verified account-owned online saves with two fictional students, cross-account and anonymous denial, fresh-browser retrieval and stale-save protection.
- Preserved source dates and all legacy admissions records. Extracted here from original GradApp commit 8f29f6d.
