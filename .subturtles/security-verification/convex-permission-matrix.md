# Convex Endpoint Permission Matrix

Built from static review of `src/convex/*.ts` on 2026-03-08.

## Scope
- Included every exported public `query`, `mutation`, and `action` in `src/convex/*.ts` except generated files.
- Counted 105 public endpoints across 20 app modules.
- Kept internal-only functions and framework wiring in the appendix because they are not directly callable from the client.

## Legend
- `Public`: no session check.
- `Session`: uses `getAuthUserId`; guests receive an error or neutral value.
- `Scoped`: session auth plus owner/admin/participant checks.
- `Aligned`: code-level authz roughly matches the endpoint's likely ownership/visibility boundary.
- `Review`: likely intentional surface area, but worth negative testing or visibility checks.
- `Gap`: code-level authz is weaker than the resource boundary implied by the endpoint.

## Immediate Negative-Test Targets
- ID spoofing writes: `comments.addComment`, `comments.deleteComment`, `connections.sendConnectionRequest`, `connections.acceptConnection`, `connections.rejectConnection`, `connections.removeConnection`, `follows.followUser`, `follows.unfollowUser`, `posts.createPost`.
- Cross-user notification access: `notifications.listNotifications`, `notifications.getUnreadCount`, `notifications.markAsRead`, `notifications.markAllAsRead`.
- `connections` visibility leaks: `comments.listComments`, `hashtags.getPostsByHashtag`, `polls.getPoll`, `polls.getResults`, `posts.listPostsByUser`, `posts.getCompanyPosts`, `posts.searchPosts`, `users.getRecentActivity`.
- Public profile overexposure: `users.getUser`, `users.getFeaturedUser`, and `users.getUserByUsername` return full user docs, which include auth-managed fields such as `email`, `image`, `emailVerificationTime`, and `isAnonymous` from `schema.ts`.
- Public maintenance/debug utilities: `messaging.backfillEncryptionKeys` and `seed.seedData`.

## `articles.ts`
| Endpoint | Observed authz | Intended scope | Assessment |
| --- | --- | --- | --- |
| `createArticle` (`mutation`) | `Session` | Authenticated author writing as self | `Aligned`: forces `authorId` from the session and always creates a public article post. |
| `getArticle` (`query`) | `Public` | Public viewers of public articles; self or accepted connection for `connections` articles | `Aligned`: enforces `connections` visibility before returning the article. |

## `bookmarks.ts`
| Endpoint | Observed authz | Intended scope | Assessment |
| --- | --- | --- | --- |
| `toggleBookmark` (`mutation`) | `Session` | Authenticated user managing their own bookmarks | `Review`: no check that the target post is visible to the caller. |
| `isBookmarked` (`query`) | `Session` | Caller reading their own bookmark state | `Aligned`: session-derived state, guests get `false`. |
| `getUserBookmarks` (`query`) | `Session` | Caller reading their own bookmarks | `Review`: returns bookmarked post payloads without re-checking post visibility. |

## `comments.ts`
| Endpoint | Observed authz | Intended scope | Assessment |
| --- | --- | --- | --- |
| `addComment` (`mutation`) | `Public`; caller supplies `authorId` | Authenticated commenter writing as self | `Gap`: direct ID spoofing and no parent-post visibility check. |
| `deleteComment` (`mutation`) | `Public`; caller supplies `userId` | Comment author only | `Gap`: any caller can delete by spoofing the comment author's ID. |
| `listComments` (`query`) | `Public` | Only viewers who may see the parent post | `Gap`: no `connections` visibility filter on the parent post. |

## `companies.ts`
| Endpoint | Observed authz | Intended scope | Assessment |
| --- | --- | --- | --- |
| `createCompany` (`mutation`) | `Session` | Authenticated user creating a company profile | `Aligned`: creator becomes the initial admin. |
| `updateCompany` (`mutation`) | `Session + company admin` | Company admins only | `Aligned`. |
| `getCompanyBySlug` (`query`) | `Public` | Public company profile read | `Aligned`. |
| `addAdmin` (`mutation`) | `Session + company admin` | Company admins only | `Aligned`: authz is enforced, though there is no invite or consent workflow. |
| `listCompanyNames` (`query`) | `Public` | Public discovery | `Aligned`. |
| `searchCompanies` (`query`) | `Public` | Public discovery | `Aligned`. |
| `getCompanySuggestions` (`query`) | `Public`; session-aware personalization | Public discovery | `Aligned`: guests still receive generic suggestions. |
| `getCompanyAnalytics` (`query`) | `Session + company admin` | Company admins only | `Aligned`: non-admins get `null`. |

## `companyFollowers.ts`
| Endpoint | Observed authz | Intended scope | Assessment |
| --- | --- | --- | --- |
| `followCompany` (`mutation`) | `Session` | Authenticated follower acting as self | `Aligned`. |
| `unfollowCompany` (`mutation`) | `Session` | Authenticated follower acting as self | `Aligned`. |
| `getFollowerCount` (`query`) | `Public` | Public aggregate | `Aligned`. |
| `isFollowing` (`query`) | `Session` | Caller reading their own follow state | `Aligned`: guests get `false`. |

## `companyPeople.ts`
| Endpoint | Observed authz | Intended scope | Assessment |
| --- | --- | --- | --- |
| `getCompanyPeople` (`query`) | `Public` | Public company-directory lookup | `Aligned`: returns a reduced user summary rather than the full user doc. |

## `connections.ts`
| Endpoint | Observed authz | Intended scope | Assessment |
| --- | --- | --- | --- |
| `sendConnectionRequest` (`mutation`) | `Public`; caller supplies `fromUserId` and `toUserId` | Authenticated requester acting as self | `Gap`: direct identity spoofing. |
| `acceptConnection` (`mutation`) | `Public` | Only the non-requesting participant should accept | `Gap`: no session or participant check. |
| `rejectConnection` (`mutation`) | `Public` | Only a connection participant should reject | `Gap`: no session or participant check. |
| `removeConnection` (`mutation`) | `Public` | Only a connection participant should remove | `Gap`: no session or participant check. |
| `getConnectionStatus` (`query`) | `Public`; caller chooses both user IDs | Usually viewer-to-target relationship only | `Review`: exposes arbitrary relationship status for any pair of users. |
| `listConnections` (`query`) | `Public`; caller chooses `userId` | Usually the profile owner or intentionally public profile viewers | `Review`: exposes a full accepted-network listing for arbitrary users. |
| `listPendingRequests` (`query`) | `Public`; caller chooses `userId` | Pending requests should be inbox-private | `Gap`: leaks another user's pending requests. |
| `getConnectionCount` (`query`) | `Public`; caller chooses `userId` | Public aggregate if profile counts are meant to be public | `Review`: aggregate-only exposure, but still arbitrary-user readable. |
| `getMutualConnectionsCount` (`query`) | `Public`; caller chooses both user IDs | Usually viewer-to-target relationship only | `Review`: arbitrary-pair network overlap is queryable. |

## `follows.ts`
| Endpoint | Observed authz | Intended scope | Assessment |
| --- | --- | --- | --- |
| `followUser` (`mutation`) | `Public`; caller supplies `followerId` | Authenticated follower acting as self | `Gap`: direct identity spoofing. |
| `unfollowUser` (`mutation`) | `Public`; caller supplies `followerId` | Authenticated follower acting as self | `Gap`: direct identity spoofing. |
| `getFollowerCount` (`query`) | `Public`; caller chooses `userId` | Public aggregate if follower counts are intentionally public | `Aligned`. |
| `getFollowingCount` (`query`) | `Public`; caller chooses `userId` | Public aggregate if following counts are intentionally public | `Aligned`. |
| `isFollowing` (`query`) | `Public`; caller chooses both user IDs | Usually viewer-to-target relationship only | `Review`: arbitrary-pair follow status is queryable. |

## `hashtags.ts`
| Endpoint | Observed authz | Intended scope | Assessment |
| --- | --- | --- | --- |
| `getPostsByHashtag` (`query`) | `Public` | Public posts only, plus `connections` posts for allowed viewers | `Gap`: no `connections` visibility filter on returned posts. |

## `likes.ts`
| Endpoint | Observed authz | Intended scope | Assessment |
| --- | --- | --- | --- |
| `toggleLike` (`mutation`) | `Session` | Authenticated user acting as self | `Review`: no visibility check on the target post. |
| `setReaction` (`mutation`) | `Session`; caller also passes unused `userId` | Authenticated user acting as self | `Review`: identity spoofing is blocked because the session user is used, but there is still no visibility check on the target post. |
| `removeReaction` (`mutation`) | `Session`; caller also passes unused `userId` | Authenticated user acting as self | `Review`: session user is used, but there is still no visibility check on the target post. |
| `getLikeStatus` (`query`) | `Public`; caller chooses `userId` and `postId` | Usually viewer/self reaction state only | `Gap`: arbitrary-user engagement lookup and no post-visibility check. |
| `getLikeStatuses` (`query`) | `Public`; caller chooses `userId` | Usually viewer/self reaction state only | `Gap`: bulk arbitrary-user engagement lookup. |
| `getUserReactionsByPostIds` (`query`) | `Public`; caller chooses `userId` | Usually viewer/self reaction state only | `Gap`: bulk arbitrary-user reaction lookup. |
| `getReactionCountsByPostIds` (`query`) | `Public`; caller chooses `postIds` | Public aggregate counts for visible posts | `Review`: aggregate-only, but there is no visibility check on the requested posts. |

## `messaging.ts`
| Endpoint | Observed authz | Intended scope | Assessment |
| --- | --- | --- | --- |
| `createConversation` (`mutation`) | `Session`; session user is always included as a participant | Authenticated user opening a thread that includes themselves | `Review`: no relationship or blocking check for the other participants. |
| `getOrCreateConversation` (`mutation`) | `Session`; session user is always included as a participant | Authenticated user opening a 1:1 thread that includes themselves | `Review`: no relationship or blocking check for the other participant. |
| `sendMessage` (`mutation`) | `Session + conversation participant` | Conversation participants only | `Aligned`. |
| `listConversations` (`query`) | `Session` | Caller reading only conversations they participate in | `Aligned`: filters to conversations containing the session user. |
| `listMessages` (`query`) | `Session + conversation participant` | Conversation participants only | `Aligned`. |
| `backfillEncryptionKeys` (`action`) | `Public` | System/admin maintenance only | `Gap`: any caller can iterate all conversations and write missing encryption keys. |

## `notifications.ts`
| Endpoint | Observed authz | Intended scope | Assessment |
| --- | --- | --- | --- |
| `listNotifications` (`query`) | `Public`; caller chooses `userId` | Notification owner only | `Gap`: cross-user inbox read. |
| `getUnreadCount` (`query`) | `Public`; caller chooses `userId` | Notification owner only | `Gap`: cross-user inbox metadata read. |
| `markAsRead` (`mutation`) | `Public`; caller chooses `notificationId` | Notification owner only | `Gap`: arbitrary notification state mutation. |
| `markAllAsRead` (`mutation`) | `Public`; caller chooses `userId` | Notification owner only | `Gap`: cross-user inbox mutation. |

## `onboarding.ts`
| Endpoint | Observed authz | Intended scope | Assessment |
| --- | --- | --- | --- |
| `completeOnboarding` (`mutation`) | `Session` | Authenticated user updating their own onboarding fields | `Aligned`. |

## `polls.ts`
| Endpoint | Observed authz | Intended scope | Assessment |
| --- | --- | --- | --- |
| `createPoll` (`mutation`) | `Session + post author` | Post author only | `Aligned`. |
| `vote` (`mutation`) | `Session` | Authenticated voter on a visible poll | `Review`: no visibility check on the poll's parent post. |
| `changeVote` (`mutation`) | `Session` | Authenticated voter on a visible poll | `Review`: no visibility check on the poll's parent post. |
| `getPoll` (`query`) | `Public` | Viewers allowed to see the parent post | `Gap`: no visibility check on the parent post. |
| `getResults` (`query`) | `Public` | Viewers allowed to see the parent post | `Gap`: no visibility check on the parent post. |
| `getUserVote` (`query`) | `Session` | Caller reading their own vote on a visible poll | `Review`: self-scoped, but no visibility check on the poll's parent post. |

## `postEdits.ts`
| Endpoint | Observed authz | Intended scope | Assessment |
| --- | --- | --- | --- |
| `getEditHistory` (`query`) | `Public` | Public viewers of public posts; self or accepted connection for `connections` posts | `Aligned`: enforces `connections` visibility before exposing edit history. |

## `posts.ts`
| Endpoint | Observed authz | Intended scope | Assessment |
| --- | --- | --- | --- |
| `listPosts` (`query`) | `Public`; session-aware filtering | Public feed plus viewer-specific `connections` visibility | `Aligned`: filters `connections` posts to self or accepted connections. |
| `listPostsByUser` (`query`) | `Public`; caller chooses `authorId` | Public posts only, plus allowed `connections` posts | `Gap`: no visibility filter on the author's posts. |
| `getCompanyPosts` (`query`) | `Public`; caller chooses `companyId` | Public company posts only, plus allowed `connections` posts | `Gap`: no visibility filter on company posts. |
| `searchPosts` (`query`) | `Public` | Search should respect post visibility | `Gap`: no visibility filter on matched posts. |
| `createPost` (`mutation`) | `Public` for guests; `Session` for signed-in users | Authenticated author writing as self | `Gap`: unauthenticated callers can create posts for arbitrary `authorId` values. |
| `createCompanyPost` (`mutation`) | `Session + company admin` | Company admins only | `Aligned`. |
| `generateImageUploadUrl` (`mutation`) | `Session` | Authenticated uploader acting as self | `Aligned`. |
| `deletePost` (`mutation`) | `Session + post author` | Post author only | `Aligned`. |
| `updatePost` (`mutation`) | `Session + post author` | Post author only | `Aligned`. |

## `reports.ts`
| Endpoint | Observed authz | Intended scope | Assessment |
| --- | --- | --- | --- |
| `reportPost` (`mutation`) | `Session` | Authenticated reporter acting as self | `Aligned`: session-scoped, though it does not re-check post visibility. |
| `hasReported` (`query`) | `Session` | Caller reading their own report state | `Aligned`: guests get `false`. |

## `reposts.ts`
| Endpoint | Observed authz | Intended scope | Assessment |
| --- | --- | --- | --- |
| `repostPost` (`mutation`) | `Session` | Authenticated reposter acting as self | `Review`: no visibility check on the original post. |
| `removeRepost` (`mutation`) | `Session + repost owner` | Repost owner only | `Aligned`. |
| `getRepostCount` (`query`) | `Public`; caller chooses `postId` | Public aggregate for visible posts | `Review`: aggregate-only, but there is no visibility check on the target post. |
| `getUserRepost` (`query`) | `Session` | Caller reading their own repost state | `Review`: self-scoped, but there is no visibility check on the target post. |

## `seed.ts`
| Endpoint | Observed authz | Intended scope | Assessment |
| --- | --- | --- | --- |
| `seedData` (`mutation`) | `Public` | Local/bootstrap-only utility | `Gap`: anonymous callers can seed demo data on an empty deployment. |

## `users.ts`
| Endpoint | Observed authz | Intended scope | Assessment |
| --- | --- | --- | --- |
| `getUser` (`query`) | `Public`; caller chooses `id` | Public profile read with limited fields | `Gap`: returns the full user doc, including auth-managed fields from `schema.ts`. |
| `getFeaturedUser` (`query`) | `Public` | Public featured profile with limited fields | `Gap`: returns the full featured user doc, including auth-managed fields. |
| `getCurrentUser` (`query`) | `Session` | Caller reading their own full user doc | `Aligned`. |
| `getUserByUsername` (`query`) | `Public`; caller chooses `username` | Public profile read with limited fields | `Gap`: returns the full user doc, including auth-managed fields. |
| `getRecentActivity` (`query`) | `Public`; caller chooses `userId` | Public viewers should only see activity tied to visible posts | `Gap`: no visibility filter on post/comment activity. |
| `isUsernameAvailable` (`query`) | `Public` | Public signup/onboarding helper | `Aligned`. |
| `searchUsersByPrefix` (`query`) | `Public` | Public discovery helper | `Aligned`: returns a reduced user summary. |
| `ensureUsername` (`mutation`) | `Session` | Authenticated user acting as self | `Aligned`. |
| `updateCurrentUserProfile` (`mutation`) | `Session` | Authenticated user acting as self | `Aligned`. |
| `addSkill` (`mutation`) | `Session` | Authenticated user acting as self | `Aligned`. |
| `removeSkill` (`mutation`) | `Session` | Authenticated user acting as self | `Aligned`. |
| `updateCurrentUserAbout` (`mutation`) | `Session` | Authenticated user acting as self | `Aligned`. |
| `addFeaturedPost` (`mutation`) | `Session + post author` | Authenticated user featuring their own post | `Aligned`. |
| `removeFeaturedPost` (`mutation`) | `Session` | Authenticated user editing their own featured list | `Aligned`. |
| `generateUploadUrl` (`mutation`) | `Session` | Authenticated uploader acting as self | `Aligned`. |
| `saveProfilePhoto` (`mutation`) | `Session` | Authenticated user acting as self | `Aligned`. |
| `generateCoverUploadUrl` (`mutation`) | `Session` | Authenticated uploader acting as self | `Aligned`. |
| `saveCoverPhoto` (`mutation`) | `Session` | Authenticated user acting as self | `Aligned`. |
| `listNetworkUsers` (`query`) | `Public`; session-aware personalization | Public directory/discovery feed | `Review`: broad directory exposure appears intentional, but should stay limited to summary fields. |
| `listAllUsers` (`query`) | `Public` | Public directory/discovery feed | `Review`: broad directory exposure appears intentional, but the returned fields are limited. |
| `addExperience` (`mutation`) | `Session` | Authenticated user acting as self | `Aligned`. |
| `updateExperience` (`mutation`) | `Session` | Authenticated user acting as self | `Aligned`. |
| `removeExperience` (`mutation`) | `Session` | Authenticated user acting as self | `Aligned`. |
| `addEducation` (`mutation`) | `Session` | Authenticated user acting as self | `Aligned`. |
| `updateEducation` (`mutation`) | `Session` | Authenticated user acting as self | `Aligned`. |
| `removeEducation` (`mutation`) | `Session` | Authenticated user acting as self | `Aligned`. |
| `searchUsers` (`query`) | `Public` | Public discovery helper | `Aligned`: returns a reduced user summary. |
| `deleteAccount` (`mutation`) | `Session` | Authenticated user deleting their own account | `Aligned`. |

## Appendix

### Internal-only Convex functions
| Export | Exposure | Notes |
| --- | --- | --- |
| `notifications.createNotification` | `internalMutation` | Server-only helper used by multiple public mutations. |
| `messaging.patchConversationKey` | `internalMutation` | Server-only helper used by `backfillEncryptionKeys`. |
| `messaging.listAllConversations` | `internalQuery` | Server-only helper used by `backfillEncryptionKeys`. |

### Framework wiring and non-endpoint modules
- `auth.ts` exports `auth`, `signIn`, `signOut`, and `store` from `convexAuth(...)`; these are framework-managed auth surfaces rather than hand-written app endpoints.
- `http.ts` only mounts `auth.addHttpRoutes(http)`; there are no custom `httpAction` routes.
- `auth.config.ts`, `helpers.ts`, and `schema.ts` do not export callable public endpoints.
