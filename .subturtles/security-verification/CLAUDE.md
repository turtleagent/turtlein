# Current task
Add negative tests for follows, connections, and comments identity spoofing paths called out by the new permission matrix.

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
- [ ] Add negative tests for follows/connections/comments identity spoofing <- current
- [ ] Add visibility leakage tests for posts/hashtags/search/comments
- [ ] Execute tests and collect evidence artifacts
- [ ] Produce release sign-off report with blockers/non-blockers
