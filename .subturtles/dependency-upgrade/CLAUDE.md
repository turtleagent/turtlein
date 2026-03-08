# Current task
Regenerate lockfile and run full build/test suite. Build and Jest pass; Playwright is failing against the deployed site's guest login/auth flow.

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
- [ ] Regenerate lockfile and run full build/test suite <- current
  Note: `npm install --legacy-peer-deps` left `package-lock.json` unchanged. `npm run build` and `CI=true npm test -- --watchAll=false` passed. `npm run test:e2e` failed against `https://linkedin-demo-iota.vercel.app` because guest login never reaches the authenticated feed in multiple specs, and the reaction flow hits `Not authenticated`.
- [ ] Produce vulnerability delta report (before vs after)
- [ ] Document rollback plan for dependency-related regressions
