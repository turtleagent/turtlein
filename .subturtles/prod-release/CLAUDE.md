# Current task
Execute staging smoke run for key paths (auth/feed/profile/messaging) on the post-remediation release candidate.

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
- [x] Define and freeze release candidate commit + checklist
- [x] Run preflight checks (build/tests/security gate outputs)
- [ ] Execute staging smoke run for key paths (auth/feed/profile/messaging) <- current
- [ ] Deploy Convex backend and validate function health
- [ ] Deploy Vercel frontend and validate production smoke tests
- [ ] Publish post-release notes and rollback instructions

## Notes
- 2026-03-08: Release candidate frozen at `e8192fc4184d6533fd21dc77e7a2b389b483c5c9` (`Harden comment mutation auth binding`) after clearing tracked runtime/task churn and confirming `git status --short` was clean at `HEAD`.
- 2026-03-08: Isolated preflight on `e8192fc4184d6533fd21dc77e7a2b389b483c5c9` succeeded for `npm ci --legacy-peer-deps`, `npm run build`, and `CI=true npm test -- --watch=false`.
- 2026-03-08: `npm audit --omit=dev --json` on the frozen candidate reported `63` vulnerabilities (`4 critical`, `27 high`, `17 moderate`, `15 low`); `react-scripts` remains a direct `high` finding, so preflight is not yet green.
- 2026-03-08: Post-freeze dependency remediation moved `@testing-library/*` to `devDependencies`, removed unused `parse-connection-url`, and overrode `@babel/runtime` to `7.28.6`; `npm audit --omit=dev` now reports `0` vulnerabilities, `npm run build` passed, `CI=true npm test -- --watch=false` passed, and `npm run test:security:authz` passed. Capture the remediation commit as the next release candidate before staging smoke.
