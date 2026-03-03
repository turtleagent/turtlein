## Current Task
Add "Delete Account" button with confirmation dialog in MeDropdown.

## End Goal with Specs
Finish the remaining legal/compliance items:
1. "Delete Account" button in Me dropdown or profile settings — confirmation dialog, then calls deleteAccount mutation
2. deleteAccount Convex mutation — cascade deletes from: users, posts, comments, likes, reactions, connections, follows, bookmarks, reports, reposts, messages, conversations, polls/pollVotes, postEdits, hashtags
3. Verify all legal pages render (/privacy, /terms, /cookies), cookie banner works, footer shows, dark mode compatible

Already shipped (committed): Privacy Policy, Terms of Service, Cookie Policy pages, CookieConsent banner, Footer with legal links, routes in App.js.

## Backlog
- [x] Create deleteAccount mutation in src/convex/users.ts — cascade delete all user data from every table
- [ ] Add "Delete Account" button with confirmation dialog in MeDropdown (src/components/header/MeDropdown.js) <- current
- [ ] Verify all legal pages render, dark mode works, footer shows, cookie banner appears on first visit
- [ ] Commit

## Notes
- Tables to cascade delete from: users, posts, comments, likes, reactions, connections, follows, bookmarks, reports, reposts, messages, conversations, polls, pollVotes, postEdits, hashtags
- Schema file: src/convex/schema.ts
- MeDropdown: src/components/header/MeDropdown.js
- Use Convex ctx.db.delete() for each record; query by userId indexes
- Confirmation dialog: "Are you sure? This will permanently delete your account and all your data."
- deleteAccount mutation completed: cascade deletes posts+related content, user activity, connections, follows, conversations, messages, notifications, poll votes, auth data, storage, and user record
