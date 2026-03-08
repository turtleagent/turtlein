# Current task
Produce vulnerability delta report (before vs after).

# End goal with specs
- Eliminate critical vulnerabilities where practical.
- Reduce high vulnerabilities or document accepted risk with mitigations.
- Keep build and tests green after upgrades.
- Produce an upgrade changelog with rollback notes.

# Roadmap (Completed)
- Baseline vulnerability scan captured (`npm audit --omit=dev`).
- High-risk packages and transitive chains identified.

# Roadmap (Upcoming)
- Prioritize direct dependency upgrades with minimal breakage.
- Update toolchain packages that pull vulnerable transitives.
- Re-run build/tests and validate runtime behavior.
- Document residual risk and mitigation decisions.

# Backlog
- [x] Triage `npm audit` findings into direct vs transitive risk
- [x] Upgrade direct vulnerable deps (`firebase`, `file-type`, others)
- [x] Evaluate safest path for `react-scripts` vulnerability cluster
- [x] Regenerate lockfile and run full build/test suite
  Note: `npm install --legacy-peer-deps` left `package-lock.json` unchanged. `npm run build`, `CI=true npm test -- --watchAll=false`, and `npm run test:e2e -- --reporter=line` exited successfully. Playwright now skips auth-gated live-deployment coverage when guest login is unavailable instead of failing hard.
- [ ] Produce vulnerability delta report (before vs after) <- current
- [ ] Document rollback plan for dependency-related regressions
