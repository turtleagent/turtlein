# Release Candidate Checklist

## Baseline
- Captured on: 2026-03-08
- Branch: `main`
- Baseline SHA under evaluation: `cee1bd65c2d8da464f5e48de7753e26404def476`
- Baseline commit: `Fix email leak in onboarding + mobile UI fixes`
- Freeze status: `blocked`

## Approved Release Payload
- Repo hygiene and release docs: `.gitignore`, `README.md`, `package.json`, `package-lock.json`
- Mobile layout/header fixes: `src/Style.js`, `src/components/header/Header.js`, `src/components/header/Style.js`
- Local verification completed on this payload:
  - `npm run build`
  - `npm test -- --watch=false`

## Current Blockers
- The worktree is not clean, so `HEAD` cannot be treated as the approved release candidate yet.
- Tracked changes outside the approved payload are still present in the worktree, including agent/runtime state churn and unrelated app/task files, which need to be resolved before the candidate SHA can be frozen from a clean worktree.

## Freeze Checklist
1. Resolve the remaining tracked non-release changes so `git status --short` is clean at `HEAD`.
2. Re-run `git rev-parse HEAD` and replace the baseline SHA above with the final release candidate SHA.
3. Confirm the release candidate commit matches the approved payload listed above and is the exact commit used for preflight, staging smoke, and production deploy.
4. Capture command results from the frozen candidate SHA for:
   - `npm run build`
   - `npm test -- --watch=false`
5. Record staging smoke coverage for auth, feed, profile, and messaging before deploy.
6. Proceed to `npx convex deploy` and `npx vercel --prod` only after the candidate SHA is frozen and preflight passes.

## Release Log Fields
- Final release candidate SHA: `PENDING`
- Preflight result links/notes: `Local build/test passed on the approved payload; rerun after freeze is still pending.`
- Staging smoke notes: `PENDING`
- Production deploy timestamps: `PENDING`
- Rollback target/version: `PENDING`
