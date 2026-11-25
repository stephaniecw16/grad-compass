# Daily Progress

## November 24, 2026 — Vercel Project Rename

- Renamed the existing Vercel project from gradapp-student to grad-compass, retaining project ID prj_LYpwAE805o2KUAj9SxC2voUD8LrU, the existing Git connection and all-URL Vercel sign-in protection.
- Confirmed the current deployment remains Ready and the existing gradapp-student.vercel.app address stays attached. Updated current repository/developer instructions to the new project name.
- A separate attempt to attach grad-compass.vercel.app was rejected by automatic approval review as an address change beyond the project rename. No new stable address or custom domain was attached; that action awaits explicit approval. No public exposure, purchase, DNS change or authentication change was made.

## November 24, 2026 — Grad Compass Rename and Domain Research

- Applied the approved name Grad Compass throughout site titles, navigation, branding, account/retired-route pages, About text, scholarship wording and calendar exports. Retained the lowercase gamma mark.
- Renamed the existing private GitHub repository to stephaniecw16/grad-compass, preserving its repository ID, history and access. Updated the GitHub description, local origin, Git safety helper, workflow label, package name and working instructions.
- Preserved browser storage/session keys, student program IDs, database records, calendar event UIDs and the existing protected Vercel preview origin. The Vercel project retains its old hosting slug for continuity.
- Checked eight domain options through Vercel without buying anything. Recommended gradcompass.org, quoted at $9.99 for the first year and $10.99/year renewal. Recorded all available alternatives and uncertainty in DOMAIN-OPTIONS.md.
- Updated README and current development guidance while retaining historical GradApp/AppHelper provenance. No public launch, paid service, domain purchase or DNS change was made.

## November 24, 2026 — Beta Testing and Online Profiles

- Ran the complete student feature suite and expanded it to 26 Chromium/WebKit browser cases, adding temporary sign-in outage recovery, profile save-failure preservation/retry, empty searches, three-school comparison/removal and deleting saved programs.
- Found and fixed a cached sign-in initialization failure that prevented retrying after a temporary configuration/network outage. Added explicit browser-only versus online profile storage instructions on My Profile.
- Tested two existing fictional Pilot accounts through the real online interface: profiles saved in Chromium returned in fresh WebKit contexts. Confirmed cross-account read/write isolation, anonymous denial and blocked owner reassignment. Retested fresh-client planning saves, stale-write rejection and expanded-catalog downgrade protection.
- Added an opt-in cross-browser cloud test with private fixture backup/restoration, explicit fictional-account guards and no traces/credentials in the repository. Retained the required version-2 marker when restoring older fictional plans. No real student account was used.
- All 23 data/model checks, 26 browser cases, source checks, lint, formatting, type contracts, fixture-configured build and seven Git safeguard tests passed. Added a beta report and concrete public-launch checklist.
- Confirmed profile storage already exists in Supabase for online accounts; local demo profiles stay in one browser. Documented remaining launch work: real email confirmation, password reset, full data export/deletion, privacy/support information and production operations. No public launch, schema/ownership-policy change or paid service was added.

## November 23, 2026 — Directory Websites, Contacts and Fresh Evidence

- Refreshed all 742 AMS listings and 1,295 degree tracks. Preserved saved plans for three reviewed AMS source-ID replacements and all original 25 program IDs.
- Checked 1,354 deduplicated public university URLs; retrieved 1,051. Searched all 258 listings missing both department and admissions URLs in AMS; added 89 directly retrieved, reviewed official department/contact/faculty pages. The directory now has department links for 556 listings and separate admissions URLs for 455.
- Reviewed 283 professional email records covering 242 listings, including department/program contacts for 171. Labeled central graduate-school and college offices separately. Combined university and AMS evidence provides usable email/phone contacts for 475 listings; AMS-only contact roles remain unverified.
- Added prominent Department Websites and Contacts sections, direct directory links, contact-coverage filtering and sourced comparison cells. Browsing and comparison stay available without a GradApp account.
- Expanded comparison to 30 fields with degree-specific AMS first-year enrollment, reported tuition/fees, stipend/salary and structured skills-training categories. Kept reporting year, currency/period, funding guarantees and unavailable policies unknown.
- Published research coverage, URL/search inventories and reproducible reports. Individual university-source fields now exist for 308 listings; retained academic/admissions research covers 90. No complete all-field verification is claimed.
- Added regression checks for contact scope, explicit source associations, unknowns and stable saved IDs, plus the contact-filter/details/comparison browser journey. Preserved the owner's two README edits made on GitHub. No account, database, private-plan ownership, billing or deployment-protection settings changed.

## November 23, 2026 — Clear Guest Browsing

- Made no-account browsing and comparison explicit on the homepage and workspace.
- Added Continue Without an Account and Compare Schools as a Guest links above the account form. Kept the fictional saving demo optional and corrected its obsolete 25-program wording.
- Account-service errors now preserve a clear guest-browsing message. Personal saves and profiles still require the appropriate account; preview protection is unchanged.
- Verified fresh-visitor comparison and browsing when account configuration is unavailable; existing planning flows remain covered by browser tests.

## November 23, 2026 — Funding and Application-Writing Research

- Added separate Scholarships and Fellowships and Application Requirements tabs, available without signing in. Funding is limited to opportunities relevant to mathematics, applied mathematics, statistics, data science and computer science; clarified that CSF meant DOE CSGF.
- Researched eight official funding programs with eligibility, degree-stage/citizenship conditions, application materials, essay limits where published, nomination routes, dates and citations. Kept closed deadlines closed and annual dates without verified years undated.
- Added 44 reviewed program/degree entries covering 49 AMS listings. Distinguished purpose/personal-history statements, optional/recommended documents and true limits versus typical lengths. Included Brown’s Fall 2027 mathematical-idea video and Boise Computing’s prerequisite, faculty-interest and programming questionnaire.
- All 742 listings have an explicit writing-research state; complete supplemental-question sets remain unverified for most programs. No prompts were invented or copied across unrelated departments/degrees.
- Connected writing guidance to Program Details and saved-program navigation, with public search, degree/coverage filters, shortlist filtering and pagination. Split reusable text escaping/link rendering into a small shared module. Existing plans and online storage are unchanged.
- Published the research inventory and added browser/model regressions for closed deadlines, nomination constraints, degree isolation, unknowns and safe text rendering. Validation results are recorded in VERIFICATION.md.

## November 23, 2026 — Complete AMS Import and Honest Field Verification

- Imported every one of the 742 AMS listing IDs, containing 1,295 advertised degree options: 693 master’s, 467 doctoral, 23 bridge/postbaccalaureate and 112 certificate tracks. Retained duplicate/incomplete records rather than silently merging them.
- Added degree and country filters, 24-card pagination, degree-specific saved plans and deadline selection. Preserved all original 25 IDs and existing notes.
- Added per-field university-source / AMS-reported / unverified states with citations, dates and scope. Blank GRE policies remain unknown; tuition, enrollment and funding are never converted into unrelated application or graduation statistics.
- Captured 458 AMS faculty counts, 695 degree-specific full-time enrollment reports and 840 raw degree-specific GRE reports. Checked 463 deduplicated university URLs and retrieved 310 public pages; link retrieval is not field verification.
- Reviewed additional university fee/waiver and GRE statements, plus explicit-cycle deadlines. University-source fields now exist for 90 listings; full independent verification of every field is not claimed. Published a coverage inventory for all 742 records.
- Corrected Acadia’s conflicting province using its university address. Kept Minnesota Statistics’ contradictory cycle wording unverified. Distinguished Washington mathematics master’s/doctoral deadlines and Pitt statistics deadlines.
- Added version-2 plan protection so older previews cannot overwrite expanded saved lists. Tested only with the reserved fictional accounts; preserved account ownership and existing record contents.
- Connected a dedicated protected GradApp (Student) Vercel project to the separate repository, without a public release or paid-service upgrade. The new protected preview is https://gradapp-student.vercel.app/ . Source/model, browser, cloud-isolation and old-client protection checks passed. A hosted review found free-text prose mixed into research categories; filters now use a short normalized taxonomy.

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
