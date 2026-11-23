# Daily Progress

## November 23, 2026 — Complete AMS Import and Honest Field Verification

- Imported every one of the 742 AMS listing IDs, containing 1,295 advertised degree options: 693 master’s, 467 doctoral, 23 bridge/postbaccalaureate and 112 certificate tracks. Retained duplicate/incomplete records rather than silently merging them.
- Added degree and country filters, 24-card pagination, degree-specific saved plans and deadline selection. Preserved all original 25 IDs and existing notes.
- Added per-field university-source / AMS-reported / unverified states with citations, dates and scope. Blank GRE policies remain unknown; tuition, enrollment and funding are never converted into unrelated application or graduation statistics.
- Captured 458 AMS faculty counts, 695 degree-specific full-time enrollment reports and 840 raw degree-specific GRE reports. Checked 463 deduplicated university URLs and retrieved 310 public pages; link retrieval is not field verification.
- Reviewed additional university fee/waiver and GRE statements, plus explicit-cycle deadlines. University-source fields now exist for 90 listings; full independent verification of every field is not claimed. Published a coverage inventory for all 742 records.
- Corrected Acadia’s conflicting province using its university address. Kept Minnesota Statistics’ contradictory cycle wording unverified. Distinguished Washington mathematics master’s/doctoral deadlines and Pitt statistics deadlines.
- Added version-2 plan protection so older previews cannot overwrite expanded saved lists. Tested only with the reserved fictional accounts; preserved account ownership and existing record contents.
- Connected a dedicated protected GradApp (Student) Vercel project to the separate repository, without a public release or paid-service upgrade. Verification and the current preview are recorded after the final build.

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
