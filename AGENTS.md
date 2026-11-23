# GradApp (Student) Working Instructions

- This private repository is the free student program research/comparison and deadline website. AppHelper and the legacy GradApp application portal are separate repositories. Do not add staff roles, application submissions, letters or private admissions files here.
- Use existing HTML/CSS/browser JavaScript. Active modules are in src/planner/; sourced program information is in src/catalog/. Keep the existing account/session and planning storage keys compatible.
- Preserve university citations, checked dates and uncertainty. Do not invent annual-cycle dates, GRE rules, fees, or missing headcounts.
- Preview locally with python3 serve.py --port 5173. Run pnpm check, pnpm test:planner, pnpm lint, pnpm format:check, pnpm typecheck, pnpm test:e2e and pnpm build as appropriate. Keep hosted dependency allowlist checks intact.
- The intended Git remote is https://github.com/stephaniecw16/gradapp-student.git. The user requested automatic commits/pushes for completed work. Run checks, review/audit explicit files, push without force to the current upstream, and verify the remote head/tree. Use the GitHub connector when terminal authentication is unavailable; never extract connector credentials. Preserve unrelated user changes.
- Keep the repository private and hosted previews protected. Ask before public release or paid services. The README's current preview belongs to the original GradApp Vercel project and is a fixed source snapshot, not an independent auto-deploy for this new repository.
- Never copy .env.local, fixture passwords, real student data, uploaded PDFs, browser exports, runtime databases or tokens into Git or dist. Use only a publishable Supabase key in the browser. Existing dev schema is already installed; do not recreate it without inspecting the project.
- Update README and docs/DAILY-PROGRESS.md for meaningful changes. The original GradApp/AppHelper repositories and all legacy records must remain intact.
