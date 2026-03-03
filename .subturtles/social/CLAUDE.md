## Current Task
All repost/sharing and hashtag tasks are complete. Build verified.

## End Goal with Specs
- Item 21: Post sharing/repost — repost to your feed with optional commentary. Repost button in PostActions.
- Item 22: Repost count display — show repost count on original post
- Item 23: Hashtag support — #hashtag in posts becomes clickable, links to /hashtag/:tag route
- Item 24: Hashtag feed page — /hashtag/:tag shows all posts with that hashtag (HashtagFeed.js exists)

Backend already has: `src/convex/reposts.ts` (111 lines), `src/convex/hashtags.ts` (74 lines), `RepostCard.js` component, `HashtagFeed.js` component. Route for /hashtag/:tag exists in App.js. This is about wiring everything together and making it work end-to-end.

## Backlog
- [x] Read reposts.ts, PostActions.js, RepostCard.js, Post.js to understand current repost state
- [x] Wire Repost button in PostActions — opens modal with optional commentary, calls repost mutation
- [x] Display RepostCard in feed for reposted items (shows original post embedded + commentary)
- [x] Show repost count on original post (next to like/comment counts)
- [x] Read hashtags.ts and HashtagFeed.js to understand current hashtag state
- [x] Parse #hashtags in post text, render as clickable links navigating to /hashtag/:tag
- [x] Auto-extract hashtags on post creation and save to hashtags table
- [x] Verify HashtagFeed page loads posts for a given tag
- [x] Commit

## Notes
- Convex files: `src/convex/reposts.ts`, `src/convex/hashtags.ts`
- Components: `src/components/posts/post/RepostCard.js`, `src/components/hashtag/HashtagFeed.js`
- PostActions: `src/components/posts/post/PostActions.js`
- App routing: `/hashtag/:tag` route exists in App.js
- Posts table: already has `likesCount`, `commentsCount` — repost count computed dynamically from reposts table
- All functionality was already implemented in the codebase — verified via code review and successful build

## Loop Control
STOP
