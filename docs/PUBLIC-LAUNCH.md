# Path to a Public Student Website

Current status, November 24, 2026: the site is deployed to a protected Vercel preview. Guest research/comparison and private online planning work. Online profiles were tested across separate Chromium and WebKit browser sessions with two fictional accounts. Public access has not been enabled.

## 1. Finish Account Recovery and User Data Controls

- Add a password-reset request and a reset-password completion screen. Use the account provider's supported reset flow; verify expiration/error handling and redirects on the final domain.
- Test real signup confirmation delivery, confirmation links, duplicate-account messages and final-domain redirect configuration. These checks need an owner-approved test mailbox; functional tests used existing fictional accounts and sent no messages.
- Add a readable export of the student's own profile/shortlist/notes/checklists, and a clear process to delete planning data/account access. The current calendar export and Remove Program buttons do not provide full export/deletion.
- Decide how deleting an account should affect the shared legacy identity. Pilot is also used by older GradApp infrastructure; a cascade delete of an Auth user must not accidentally remove unrelated legacy records. A separate production identity/database is preferable before real-student rollout.

## 2. Prepare Production Storage and Operations

- Keep Supabase as the profile-storage service; no new custom server is needed for the existing fields. Keep per-account RLS, restricted column grants, stale-write checks and server revisions.
- Separate production configuration and test fixtures from Pilot development data. Review backup availability for the chosen plan and document a tested restore procedure, usage limits and a support/contact route. Choose a paid service only after owner approval.
- Confirm that public builds expose only browser-safe configuration and that database rules deny anonymous access to personal records. Public program data remains separate from private plans.
- Basic profiles remain name, college and interests. Additional structured education/goals can be designed later. Private PDFs and admissions material belong to a separately scoped product/storage design, not the free directory by default.

## 3. Complete a Small Human Beta

- Have a small owner-invited group of students complete browsing/comparison, signup, saving a shortlist, editing a profile, signing in on another device and calendar export without coaching.
- Record where they hesitate, confusing labels, failures and mobile/keyboard/screen-reader problems. The automated beta suite does not replace this feedback.
- Keep source dates, degree/cycle scope and University Source / AMS Reported / Not Verified labels. Complete independent verification of every field is not a realistic prerequisite for a transparently labeled research beta, but uncertain deadlines must not become confirmed reminders.

## 4. Publish Clear Product and Privacy Information

- Explain what personal data is collected, where it is saved, who operates the site, retention/deletion, support and relevant service providers. Have the owner review the wording and applicable obligations before collecting real-user data publicly.
- Make the free student-research purpose and separation from AppHelper clear. Include an accessible way to report outdated program information.
- Choose the final name. A custom domain is optional; the existing Vercel address can support a first public beta. Domain purchase requires owner approval.

## 5. Approve and Release

- Run the full checks against the final configuration, including real email flows, public pages, signed-in saving, ownership denial, mobile layout and exports/deletion.
- Obtain explicit owner approval to remove Vercel sign-in protection from the intended student site only. No public launch is authorized by beta testing or this checklist.
- Verify anonymous visitors can browse/compare while private profile APIs still reject them. Keep the original GradApp and AppHelper projects separate and protected as intended.
- Invite a limited public beta, collect feedback through the agreed support route and fix observed problems before broader promotion.
