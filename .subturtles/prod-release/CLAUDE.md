# Current task
Finish freezing the release candidate commit by clearing the remaining tracked non-release churn from the worktree, then record the final SHA in `.subturtles/prod-release/release-checklist.md`.

# End goal with specs
- Stage deployment completes with smoke checks passing.
- Production deploy (`convex` + `vercel`) executes from a clean, approved commit.
- Rollback steps are documented and tested.
- Post-deploy monitoring and alert checks are in place.

# Roadmap (Completed)
- Build/test commands and deployment commands validated in repo context.
- Release prerequisites and risk areas identified.

# Roadmap (Upcoming)
- Prepare release checklist tied to commit SHA.
- Execute staging smoke and verify critical user journeys.
- Perform production deploy and validate health signals.
- Document release outcome and rollback readiness.

# Backlog
- [ ] Define and freeze release candidate commit + checklist <- current
- [ ] Run preflight checks (build/tests/security gate outputs)
- [ ] Execute staging smoke run for key paths (auth/feed/profile/messaging)
- [ ] Deploy Convex backend and validate function health
- [ ] Deploy Vercel frontend and validate production smoke tests
- [ ] Publish post-release notes and rollback instructions

## Notes
- 2026-03-08: Baseline SHA `cee1bd65c2d8da464f5e48de7753e26404def476` captured in `.subturtles/prod-release/release-checklist.md`; freeze remains blocked until the worktree is reduced to the approved release changes.
- 2026-03-08: Approved release payload was verified locally with `npm run build` and `npm test -- --watch=false`; freeze still cannot be finalized while tracked changes outside that approved payload remain in the worktree.
