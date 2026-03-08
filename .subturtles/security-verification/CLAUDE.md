# Current task
All backlog items completed.

# End goal with specs
- Build a function-level permission matrix for all Convex public APIs.
- Add negative tests for ID spoofing and unauthorized reads/writes.
- Validate visibility protections for `connections`-only content.
- Deliver a go/no-go report with reproducible checks.

# Roadmap (Completed)
- Initial vulnerability hypotheses collected from prior audit.
- High-risk function clusters identified for targeted verification.

# Roadmap (Upcoming)
- Enumerate all Convex functions and expected caller permissions.
- Implement authz regression tests for critical modules.
- Run test suite and document failures/remediations.
- Publish final verification report.

# Backlog
- [x] Build endpoint permission matrix for `src/convex/*.ts`
- [x] Add negative tests for messaging/notifications authz bypass
- [x] Add negative tests for follows/connections/comments identity spoofing
- [x] Add visibility leakage tests for posts/hashtags/search/comments
- [x] Execute tests and collect evidence artifacts
- [x] Produce release sign-off report with blockers/non-blockers

## Notes
- 2026-03-08: Captured raw verification artifacts in `.subturtles/security-verification/artifacts/` and indexed them in `.subturtles/security-verification/test-evidence.md`.

## Loop Control
STOP
