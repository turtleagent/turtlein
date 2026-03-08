# Release Sign-Off Report

Generated on 2026-03-08 for commit `581ec1d478b52601e567d577f9326d2a44ab9e6c`.

## Verdict

`NO-GO`

Release should not be approved yet. The targeted authz regression suite passes and the app builds, but several public Convex APIs still allow unauthorized writes or visibility bypasses outside the covered test set.

## Evidence Reviewed

- Static review in `.subturtles/security-verification/convex-permission-matrix.md`
- Test and build evidence in `.subturtles/security-verification/test-evidence.md`
- Authz regression coverage in `tests/security-authz.test.mjs`

## Passing Coverage

- Notifications now require a session and prevent cross-user read/write access.
- Messaging reads and sends are participant-scoped, and guest calls to the maintenance backfill action are rejected.
- Follows, connections, and comments bind writes to the session user instead of trusting spoofable IDs.
- `connections`-only visibility is enforced for comments, hashtag results, per-user post lists, company post lists, and post search.
- Public user-profile queries strip auth-managed private fields before returning data.
- Prior verification artifacts show `npm run test:security:authz`, `CI=true npm test -- --watchAll=false`, and `npm run build` all passing.

## Release Blockers

1. `posts.createPost` still permits guest-authored writes.
   File: `src/convex/posts.ts:429`
   The handler accepts caller-supplied `authorId` whenever `getAuthUserId(ctx)` is null and inserts the post anyway. An unauthenticated client can create content as any known user ID.

2. `messaging.backfillEncryptionKeys` is callable by any authenticated user.
   File: `src/convex/messaging.ts:296`
   The action only checks that the caller is signed in, then iterates all conversations through internal queries and patches missing encryption keys. This is a global maintenance write path without admin gating.

3. `connections`-only post visibility is still bypassable through secondary engagement APIs.
   Files: `src/convex/polls.ts:79`, `src/convex/polls.ts:153`, `src/convex/likes.ts:36`, `src/convex/likes.ts:209`, `src/convex/bookmarks.ts:44`, `src/convex/bookmarks.ts:102`, `src/convex/reposts.ts:14`, `src/convex/reposts.ts:80`
   These endpoints accept `postId` or `pollId` and read or mutate state without calling `canViewerAccessPost` or `filterVisiblePosts`. A caller who knows a hidden post ID can still probe reactions, vote in polls, bookmark content, or repost it despite failing normal feed/search visibility checks.

4. `users.getRecentActivity` can leak activity tied to hidden posts.
   File: `src/convex/users.ts:189`
   The query aggregates a user's posts and comments, then returns `postPreview` and related author metadata without filtering by post visibility. This can expose `connections`-only content through profile activity.

5. `seed.seedData` remains a public mutation.
   File: `src/convex/seed.ts:4`
   Any anonymous caller can populate an empty deployment with demo users and posts. This is lower impact on an already-initialized production database, but it is still an exposed production write surface and should be gated or removed before release.

## Non-Blocking Items

- Existing warnings in the evidence logs remain non-blocking for sign-off:
  - Node `ExperimentalWarning` and `MODULE_TYPELESS_PACKAGE_JSON` warnings during `npm run test:security:authz`
  - React 18 / Material-UI v4 / React Router deprecation warnings during Jest
  - Browserslist `caniuse-lite` update warning during build
- `connections.listConnections` remains broadly readable, but current product behavior appears intentionally social-network-facing rather than obviously unauthorized. This should be product-reviewed, but it is not a release blocker on its own.

## Required Before Go-Live

1. Require authenticated self-authorship for `posts.createPost`.
2. Remove, internalize, or admin-gate `messaging.backfillEncryptionKeys` and `seed.seedData`.
3. Apply shared post-visibility checks to poll, like/reaction, bookmark, repost, and report surfaces.
4. Filter `users.getRecentActivity` by post visibility.
5. Add negative tests that prove the blocker endpoints reject hidden-post access and unauthorized callers.
