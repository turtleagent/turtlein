# Release Candidate Checklist

## Baseline
- Captured on: 2026-03-08
- Branch: `main`
- Frozen release candidate SHA: `e8192fc4184d6533fd21dc77e7a2b389b483c5c9`
- Frozen release candidate commit: `Harden comment mutation auth binding`
- Freeze status: `frozen`

## Approved Release Payload
- Repo hygiene and release docs: `.gitignore`, `README.md`, `package.json`, `package-lock.json`
- Mobile layout/header fixes: `src/Style.js`, `src/components/header/Header.js`, `src/components/header/Style.js`
- Privacy disclosure alignment: `docs/legal-data-flow-map.md`, `src/components/legal/PrivacyPolicy.js`
- Comment auth hardening: `src/convex/comments.ts`, `src/components/posts/post/PostComments.js`
- Local verification completed before the freeze on the earlier approved payload:
  - `npm run build`
  - `npm test -- --watch=false`

## Current Blockers
- Freeze blockers cleared. `git status --short` was clean at `HEAD` when `e8192fc4184d6533fd21dc77e7a2b389b483c5c9` was captured.
- Preflight build/test passed in an isolated worktree at the frozen SHA after `npm ci --legacy-peer-deps`.
- The production dependency gate is still blocking release: `npm audit --omit=dev --json` reported `63` vulnerabilities (`4 critical`, `27 high`, `17 moderate`, `15 low`), with `react-scripts` still flagged as a direct `high` dependency on the frozen candidate.
- Fresh installs of the frozen candidate require `--legacy-peer-deps` because the repo still combines React 18 with Material-UI v4 peer ranges.

## Freeze Checklist
1. [x] Resolve the remaining tracked non-release changes so `git status --short` is clean at `HEAD`.
2. [x] Re-run `git rev-parse HEAD` and replace the baseline SHA above with the final release candidate SHA.
3. [x] Confirm the release candidate commit matches the approved payload listed above and is the exact commit to carry into preflight, staging smoke, and production deploy.
4. [x] Capture command results from the frozen candidate SHA for:
   - `npm run build`
   - `npm test -- --watch=false`
5. [ ] Record staging smoke coverage for auth, feed, profile, and messaging before deploy.
6. [ ] Proceed to `npx convex deploy` and `npx vercel --prod` only after the candidate SHA is frozen and preflight passes.

## Release Log Fields
- Final release candidate SHA: `e8192fc4184d6533fd21dc77e7a2b389b483c5c9`
- Preflight result links/notes: `2026-03-08 isolated worktree preflight on e8192fc: npm ci --legacy-peer-deps succeeded; npm run build passed; CI=true npm test -- --watch=false passed (1 suite / 1 test); npm audit --omit=dev reported 63 vulnerabilities (4 critical, 27 high, 17 moderate, 15 low) with react-scripts:high still direct.`
- Staging smoke notes: `PENDING`
- Production deploy timestamps: `PENDING`
- Rollback target/version: `PENDING`
