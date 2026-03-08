# Legal Data Flow Map

This document maps the app's actual data handling in `src/convex` to the current legal copy in:

- `src/components/legal/PrivacyPolicy.js`
- `src/components/legal/TermsOfService.js`
- `src/components/legal/CookiePolicy.js`

It is an internal review artifact for legal copy updates. It is not user-facing policy text.

## Sources Reviewed

- `src/convex/schema.ts`
- `src/convex/auth.ts`
- `src/convex/onboarding.ts`
- `src/convex/users.ts`
- `src/convex/posts.ts`
- `src/convex/articles.ts`
- `src/convex/comments.ts`
- `src/convex/likes.ts`
- `src/convex/reposts.ts`
- `src/convex/polls.ts`
- `src/convex/bookmarks.ts`
- `src/convex/reports.ts`
- `src/convex/connections.ts`
- `src/convex/follows.ts`
- `src/convex/companyFollowers.ts`
- `src/convex/companies.ts`
- `src/convex/messaging.ts`
- `src/convex/notifications.ts`
- `src/components/messaging/Messaging.js`

## Code-to-Policy Crosswalk

| Data domain | Actual collection/storage | Main read/use paths | Current legal coverage | Gaps to address next |
| --- | --- | --- | --- | --- |
| Authentication and account bootstrap | Convex Auth creates `auth*` tables plus `users` fields including `name`, `email`, `image`, `emailVerificationTime`, and `isAnonymous`. `src/convex/auth.ts` enables both Google and GitHub providers. `src/convex/onboarding.ts` and `src/convex/users.ts` add `username`, `displayName`, `title`, and `location`. | `users.getCurrentUser`, `users.getUser`, `users.getUserByUsername`, username search, and onboarding/profile flows read this data. | Privacy Policy sections 2-4 now disclose Google and GitHub sign-in, auth/session records, email-verification metadata, and username/profile bootstrap processing. | Core disclosure is now aligned for this review pass. Deletion/retention handling for auth records remains a separate validation item. |
| Profile and resume-style data | `users` stores `displayName`, `username`, `photoURL`, `photoStorageId`, `coverStorageId`, `title`, `headline`, `location`, `about`, `skills`, `experienceEntries`, `educationEntries`, `featuredPostIds`, `connections`, `followers`, and `isFeatured`. Photo and cover images are uploaded to Convex storage. | Read by profile pages, user search, network discovery, featured user lookup, author summaries, and company admin flows. | Privacy Policy sections 2-3 now call out usernames, profile/cover images, featured posts, connection/follower counts, and use in search/discovery features. Terms section 3 still treats profile information as user content. | Core disclosure is now aligned for profile/search processing. Company/admin profile data is still tracked separately under the company-data review item. |
| Posts, articles, comments, media, edit history, hashtags, polls | `posts`, `comments`, `postEdits`, `hashtags`, `polls`, and `pollVotes` store authored content, article titles/bodies, uploaded images, edit history, hashtags, and poll votes. `posts.createPost`, `posts.createCompanyPost`, `articles.createArticle`, `comments.addComment`, `posts.updatePost`, and `polls.vote/changeVote` collect this data. | Feed queries, profile/company post views, search, edit history dialogs, bookmark views, and poll result queries expose the data. Post visibility can be `public` or `connections`. | Privacy Policy section 2 covers posts, comments, reactions, reposts, reports, and edit history. Terms section 3 covers user content generally. | Current copy does not explicitly mention articles, poll votes, hashtags, uploaded media in Convex storage, company-authored posts, mentions, or connections-only visibility rules. |
| Reactions, likes, reposts, and bookmarks | `likes`, `reactions`, `reposts`, and `bookmarks` store engagement records, timestamps, commentary on reposts, and saved-post state. | Feed ranking, reaction counts, repost counts, bookmark pages, and profile activity use this data. | Privacy Policy section 2 covers reactions/likes, reposts, and saved posts/bookmarks. | This is mostly covered, but repost commentary and bookmark timestamps are not spelled out. |
| Connections, follows, and company follows | `connections` stores `userId1`, `userId2`, `status`, `requestedBy`, and `createdAt`. `follows` and `companyFollowers` store follow relationships and timestamps. `users.connections` is also denormalized for display. | Network pages, pending request lists, mutual connection counts, following state, and company suggestions rely on this data. | Privacy Policy section 2 covers connection requests, accepted connections, and following/followers. | Current copy does not explicitly mention pending request metadata, `requestedBy`, company follow records, mutual-connection calculations, or recommendation/suggestion use of relationship data. |
| Messaging and conversation metadata | `conversations` stores participant IDs, `createdAt`, and an optional `encryptionKey`. `messages` stores `conversationId`, `senderId`, message `body`, `createdAt`, and an optional `encrypted` flag. `src/components/messaging/Messaging.js` encrypts/decrypts message bodies in the browser when a conversation key exists, but the conversation key itself is still stored server-side. | Conversation lists show participants and latest-message previews. Message list queries return message bodies plus sender summaries. Message sends generate notifications for recipients. | Privacy Policy sections 2-3 now disclose conversation participants, timestamps, preview generation, encrypted/plaintext storage behavior, optional browser-side encryption, and backend storage of the conversation key. Terms section 3 still includes messages as user content. | Core disclosure is now aligned for message handling. Deletion/retention remains a separate validation item. |
| Notifications | `notifications` stores `userId`, `type`, `fromUserId`, optional `postId`, optional `companyId`, optional `conversationId`, `read`, and `createdAt`. Notifications are created from likes, comments, follows, company follows, connection requests/acceptance, mentions, and messages. | Header unread count, notifications list, and mark-read flows use this data. | Privacy Policy sections 2-3 now explicitly list notification records, event types, related IDs, read status, timestamps, unread counts, and in-app alert use. | Core disclosure is now aligned for notification storage and use. Deletion/retention remains a separate validation item. |
| Safety, abuse, and moderation reports | `reports` stores reporting user, target post, reason, optional free-form details, and timestamp. | Report dialogs write this data; duplicate-report checks and account deletion logic read it. Terms section 4 also sets conduct rules that reports are meant to enforce. | Privacy Policy section 2 mentions reports. Privacy Policy section 3 mentions safety and integrity. | The policy should be more explicit that free-form report details may contain personal data and are processed for trust-and-safety review. |
| Companies, admins, and company analytics | `companies` stores company identity, descriptive fields, optional logo/cover storage IDs, `createdBy`, `admins`, and `createdAt`. Company follower analytics derive from `companyFollowers` and `posts`. | Company pages, search, suggestions, and admin analytics use this data. | Current legal copy does not specifically call out company records or admin relationships. | Because company records include creator/admin user IDs and company follower analytics, the policies should disclose this admin/business profile processing. |
| Deletion and retention dependencies | `users.deleteAccount` hard-deletes the user record, auth records, profile media, authored posts, related post metadata, social graph records, conversations, messages, notifications, and several related records from other users that are attached to the deleted user's posts or conversations. It does not clean up `companies.createdBy` or `companies.admins` references. | Account deletion is triggered from the header dropdown and acts as the main retention/deletion implementation. | Privacy Policy section 5 and Terms section 6 discuss deletion and retention only at a high level. | Validation shows the current copy is too generic: it does not explain the full cascade, it suggests anonymization/retention paths that are not visible in code, and it overstates completeness because company references can survive deletion. |

## Deletion/Retention Validation

Reviewed against `src/convex/users.ts` (`deleteAccount`) and the user-linked tables in `src/convex/schema.ts`.

| Data category | What `deleteAccount` does now | Disclosure impact |
| --- | --- | --- |
| Account, auth, and profile media | Deletes the `users` row, auth sessions, refresh tokens, auth accounts, verification codes, auth verifiers linked to deleted sessions, and the user's profile/cover storage objects. | The current policy text implies deletion or anonymization with possible retention. In the reviewed application code, this path is immediate deletion; no anonymization branch or application-level retention carve-out is implemented here. |
| User-authored posts and attached metadata | Deletes all posts authored by the user, including company posts and article-style posts, plus attached storage images, post edits, polls, poll votes on those polls, comments, likes, reactions, hashtags, reports, and reposts tied to those posts. | Legal copy should make clear that deleting an account removes authored content and also removes engagement/report records attached to that content. |
| User activity on other content | Deletes the user's own likes, bookmarks, reactions, reposts, comments, reports, and poll votes on other records. It also removes bookmarks that point to the deleted user's posts. | This generally fits "associated data," but the current language does not spell out that saved items and vote history are also removed. |
| Messaging and conversations | Deletes every conversation that includes the user and deletes every message in those conversations, including messages sent by other participants. | Current retention/termination wording understates the impact. Account deletion removes entire threads, not just the deleting user's access or copy of messages. |
| Notifications and relationship records | Deletes connections where the user is either side, follows where the user is either side, company follows by the user, and notifications where the user is either the recipient or actor (`fromUserId`). | The current terms should acknowledge that account deletion removes in-app activity history tied to that user, including notifications delivered to other users. |
| Company/admin references | Does not delete companies created by the user and does not remove the user ID from `companies.createdBy` or `companies.admins`. Those records can remain with dangling references after the user row is deleted. | Privacy/terms copy should not promise complete deletion of all app references until this is fixed in code or handled operationally. |

### Validation Outcome

1. Privacy Policy section 5 is not yet precise enough for the implementation. It should describe deletion as a broad hard-delete cascade in the app, not as a generic "delete or anonymize" flow.
2. Terms section 6 understates the practical effect of deletion because the current code removes entire conversations and other related records, not just the deleting user's access.
3. No application-level timed retention or exception path was found in the reviewed code. If the product relies on backups, logs, provider records, or manual legal holds, that needs separate operational confirmation before the policies mention it.
4. The highest-priority product gap is company ownership/admin cleanup: company records can outlive the user while still referencing the deleted account ID.

## High-Signal Findings

1. Auth, profile, messaging, and notification disclosures have been brought into line with the current implementation in `PrivacyPolicy.js`.
2. Messaging still uses browser-side encryption helpers while backend storage retains conversation metadata and the conversation encryption key, so future privacy edits should preserve that nuance.
3. Account deletion is a hard-delete cascade in application code and also removes some counterparty records tied to the deleted user's posts, conversations, and notifications.
4. Company/admin data is materially processed in the app, and company records can retain dangling `createdBy`/`admins` references after account deletion.
5. Cookie/local storage disclosures are now the next highest-risk review area.

## Suggested Next Review Order

1. Validate cookie and local storage disclosures separately from this Convex-focused map.
2. Patch the deletion/retention copy so it reflects the hard-delete cascade and the current company-reference limitation.
3. Patch the remaining company/admin and content-metadata legal gaps after those validation passes.
