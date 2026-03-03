## Current Task
All feed features implemented. Mark complete and commit.

## End Goal with Specs
- Item 25: @mention — type @username in posts/comments triggers autocomplete dropdown (MentionAutocomplete.js exists), creates notification on post
- Item 26: Post visibility — Public / Connections Only toggle in post creation form (schema already has `visibility` field)
- Item 27: Feed algorithm — sort by: Recent (default), Top (most engagement), Following (connections only). Toggle buttons above feed.
- Item 28: Feed "Follow" vs "Connect" — follow someone to see their posts without connecting. Follow button on profiles for non-connections.
- Item 29: followers table + followUser/unfollowUser mutations + follower count query (follows.ts already exists, 119 lines)
- Item 30: Infinite scroll — load 10 posts at a time, fetch more on scroll bottom

## Backlog
- [x] Read follows.ts, MentionAutocomplete.js, Form.js, Posts.js to understand current state
- [x] Wire @mention autocomplete in post/comment text input — type @ triggers dropdown, selecting user inserts @username
- [x] Add post visibility toggle (Public/Connections) in Form.js — save to post.visibility field
- [x] Filter feed by visibility: connections-only posts only visible to author's connections
- [x] Add feed sort tabs above Posts: "Recent" | "Top" | "Following" — implement sorting logic in Convex query
- [x] Wire Follow button on user profiles and in search results — followUser/unfollowUser mutations
- [x] Show follower count on profiles alongside connection count
- [x] Implement infinite scroll in Posts.js — paginate with cursor-based loading, "Load more" or scroll trigger
- [x] Test: mention a user, toggle visibility, switch feed sorts, follow/unfollow, scroll pagination
- [x] Commit

## Notes
- Key files: `src/convex/follows.ts`, `src/convex/posts.ts`, `src/convex/users.ts`
- Components: `src/components/mentions/MentionAutocomplete.js`, `src/components/form/Form.js`, `src/components/posts/Posts.js`
- Schema: follows table with followerId/followedId + indexes. Posts have optional `visibility` field.
- Users table has `followers` field (optional number)
- For feed algorithm: "Top" = sort by (likesCount + commentsCount) desc; "Following" = filter by connections + follows

## Loop Control
STOP
