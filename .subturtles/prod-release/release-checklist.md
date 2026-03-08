# Release Candidate Checklist

## Baseline
- Captured on: 2026-03-08
- Branch: `main`
- Baseline SHA under evaluation: `cee1bd65c2d8da464f5e48de7753e26404def476`
- Baseline commit: `Fix email leak in onboarding + mobile UI fixes`
- Freeze status: `blocked`

## Current Blockers
- The worktree is not clean, so `HEAD` cannot be treated as the approved release candidate yet.
- Intended release-related changes are still uncommitted in `.gitignore`, `README.md`, `package.json`, `package-lock.json`, `src/Style.js`, `src/components/header/Header.js`, and `src/components/header/Style.js`.
- Runtime/archive churn is also present in `.superturtle/state/*` and several `.subturtles/*` paths, which needs to be excluded from the final release commit.

## Freeze Checklist
1. Reduce `git status --short` to only the approved release changes, then commit them on `main`.
2. Re-run `git rev-parse HEAD` and replace the baseline SHA above with the final release candidate SHA.
3. Confirm the release candidate commit is the exact commit used for preflight, staging smoke, and production deploy.
4. Capture command results for:
   - `npm run build`
   - `npm test -- --watch=false`
5. Record staging smoke coverage for auth, feed, profile, and messaging before deploy.
6. Proceed to `npx convex deploy` and `npx vercel --prod` only after the candidate SHA is frozen and preflight passes.

## Release Log Fields
- Final release candidate SHA: `PENDING`
- Preflight result links/notes: `PENDING`
- Staging smoke notes: `PENDING`
- Production deploy timestamps: `PENDING`
- Rollback target/version: `PENDING`
