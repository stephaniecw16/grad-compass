# Grad Compass Production Setup

Checked November 24, 2026 (America/New_York).

## Created and Verified

| Item | State |
| --- | --- |
| Organization | Grad Compass · `qnwbxmmxbympxokepfwf` · Free ($0/month) |
| Project | grad-compass-production · `bbdqxyaxccluyzzcoyoc` |
| Region | us-east-1 |
| Project health | ACTIVE_HEALTHY after creation |
| GitHub repository | stephaniecw16/grad-compass |
| Integration working directory | `.` (repository-root supabase folder) |
| Automatic database deployment | Off pending schema and recovery checks |
| Automatic preview branching | Off; requires a paid plan, not approved |
| Hosted website storage | Still the existing Pilot development project |

[New project integration settings](https://supabase.com/dashboard/project/bbdqxyaxccluyzzcoyoc/settings/integrations)

The new project is intentionally separate from Pilot (`ngcrddnjkkgotlmrnxkf`) in the older GradApp organization. It has not received legacy data or replaced the website’s account configuration. Its name does not mean it is ready for public production use.

## Remaining Before Switching Accounts

1. Inspect the empty project and install the account-owned planning schema, revision protection and version-2 guard. Verify grants, row-level security and cross-account denial with fictional accounts.
2. Inventory existing student-planning records in Pilot before changing the hosted configuration. The refreshed connection currently covers only the new organization. Preserve real profiles and account identities; do not copy or delete the shared legacy admissions/auth database indiscriminately.
3. Configure the exact approved confirmation and password-recovery callbacks. Implement recovery and verify actual confirmation/reset delivery to the owner-approved admin@gradapp.org address. A GitHub connection does not configure an email sender.
4. Complete profile/shortlist export and deletion controls and privacy/support information. The approved public support address is admin@gradapp.org.
5. Establish a backup and restoration process, then rehearse it without overwriting live data. Free-plan project creation does not provide managed daily backups or point-in-time recovery. No backup or recovery verification is claimed yet.
6. Review actual usage/limits before launch. The organization dashboard currently advertises 500 MB database size, 5 GB egress, 50,000 monthly active users and 1 GB file storage. These limits do not constitute a capacity or availability guarantee. Free projects may pause after inactivity.
7. Only switch the protected Vercel website after account continuity and retrieval checks pass. Keep all-URL preview protection. Public launch and any paid upgrade require owner approval.

Supabase’s integration can deploy migrations, configured functions and buckets when production deployment is enabled; linking alone does not deploy the frontend or migrate accounts. Auth/email settings require separate configuration.

## References

- [Supabase GitHub integration](https://supabase.com/docs/guides/deployment/branching/github-integration)
- [Production checklist](https://supabase.com/docs/guides/deployment/going-into-prod)
- [Backups and recovery](https://supabase.com/docs/guides/platform/backups)
- [Email delivery / SMTP](https://supabase.com/docs/guides/auth/auth-smtp)
