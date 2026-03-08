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
| Deletion and retention dependencies | `users.deleteAccount` cascades through posts, media, comments, likes, reactions, reposts, bookmarks, reports, connections, follows, company follows, conversations, messages, notifications, auth sessions/accounts, verification records, and stored images. | Account deletion is triggered from the header dropdown and acts as the main retention/deletion implementation. | Privacy Policy section 5 and Terms section 6 discuss deletion and retention only at a high level. | Retention and deletion statements need a dedicated validation pass against actual cascade behavior. This is already a separate backlog item. |

## High-Signal Findings

1. Auth, profile, messaging, and notification disclosures have been brought into line with the current implementation in `PrivacyPolicy.js`.
2. Messaging still uses browser-side encryption helpers while backend storage retains conversation metadata and the conversation encryption key, so future privacy edits should preserve that nuance.
3. Company/admin data is materially processed in the app but is still absent from the current legal copy.
4. Deletion/retention language and cookie/local storage disclosures remain the next highest-risk review areas.

## Suggested Next Review Order

1. Validate deletion and retention language against `users.deleteAccount`.
2. Validate cookie and local storage disclosures separately from this Convex-focused map.
3. Patch the remaining company/admin and content-metadata legal gaps after those validation passes.
