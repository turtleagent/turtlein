# Current task
Enforce visibility in `posts/hashtags/comments` read APIs.

# End goal with specs
- Bind all sensitive mutations/queries to authenticated identity (`getAuthUserId`).
- Remove caller-controlled identity fields for privileged operations.
- Enforce ownership/participant checks for messaging, notifications, comments, follows, and connections.
- Enforce visibility rules consistently for private (`connections`) content access paths.

# Roadmap (Completed)
- Baseline security review completed with user-data leakage findings.
- Critical weak points identified in messaging, notifications, social graph, and profile data paths.

# Roadmap (Upcoming)
- Patch messaging functions for auth + participant authorization.
- Patch notifications functions for ownership-bound reads/writes.
- Patch social mutations to derive actor identity server-side.
- Patch read paths to enforce visibility/connection authorization.

# Backlog
- [x] Harden `src/convex/messaging.ts` auth and participant checks
- [x] Harden `src/convex/notifications.ts` ownership checks
- [x] Harden `src/convex/comments.ts` actor identity + delete authorization
- [x] Harden `src/convex/follows.ts` and `src/convex/connections.ts` actor binding
- [ ] Enforce visibility in `posts/hashtags/comments` read APIs <- current
- [ ] Sanitize user-return payloads to avoid exposing private fields
