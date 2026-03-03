## Current Task
All backlog items complete. Polls, articles, bookmarks, reports, and edit history features verified end-to-end.

## End Goal with Specs
- Item 31: Poll posts — create a poll with 2-4 options when composing a post, users vote, show results with percentages. (polls.ts 232 lines + poll/ component dir exist)
- Item 32: Article/long-form posts — "Write article" flow, rich text editor, full-page article view. (articles.ts 122 lines + ArticleEditor.js + ArticleView.js exist, /write-article and /article/:id routes in App.js)
- Item 33: Post save/bookmark — save button on posts, "Saved" tab accessible at /saved. (bookmarks.ts 135 lines + SavedPosts.js exist, /saved route in App.js)
- Item 34: Report post — report button with reason dropdown, store in DB. (reports.ts 88 lines + report/ component dir exist)
- Item 35: Edit post history — "Edited" badge on edited posts, view edit history. (postEdits.ts 66 lines + editHistory/ dir exist)

Most backend + frontend scaffolding already exists. This is about verifying everything works end-to-end, fixing wiring issues, and adding missing UI pieces.

## Backlog
- [x] Read poll/ components, polls.ts — verify poll creation in Form and poll voting in Post
- [x] Wire poll creation: option in Form to "Create Poll" with 2-4 text options + question
- [x] Wire poll voting: click option to vote, show % results after voting, prevent double-vote
- [x] Read ArticleEditor.js, ArticleView.js, articles.ts — verify article creation + viewing flow
- [x] Ensure "Write Article" button navigates to /write-article, editor saves, article view at /article/:id works
- [x] Read SavedPosts.js, bookmarks.ts — verify bookmark toggle on posts and /saved page displays bookmarked posts
- [x] Wire bookmark/save button in PostActions if not already there
- [x] Read report/ components, reports.ts — verify report modal with reason dropdown works
- [x] Wire Report option in post "more" menu (⋯) if not already there
- [x] Read editHistory/ components, postEdits.ts — verify "Edited" badge and edit history viewing
- [x] Test all 5 features end-to-end
- [x] Commit

## Notes
- Convex: polls.ts, articles.ts, bookmarks.ts, reports.ts, postEdits.ts (all exist)
- Components: src/components/posts/poll/, src/components/articles/, src/components/bookmarks/SavedPosts.js, src/components/posts/report/, src/components/posts/editHistory/
- Routes: /write-article, /article/:id, /saved (all in App.js)
- PostActions.js has the action buttons — bookmark button is wired (Save/Saved toggle with filled icon)
- Report button wired in PostHeader menu for non-own posts
- Schema: polls, pollVotes, bookmarks, reports, postEdits tables all defined

## Verification Summary
All 5 features verified as fully wired end-to-end:
1. **Polls**: Form.js has poll composer (toggle, question+options inputs, validation). createPoll called after createPost. PollDisplay renders in Post.js with vote/changeVote.
2. **Articles**: /write-article route → ArticleEditor (title+body, publish). /article/:id → ArticleView (rich text render, reactions).
3. **Bookmarks**: Save button in PostActions (Bookmark icon, filled when saved). toggleBookmark mutation. /saved route → SavedPosts page.
4. **Reports**: Report option in PostHeader context menu (non-own posts). ReportDialog with reason dropdown + optional details. reportPost mutation.
5. **Edit History**: isEdited flag set on post update. "Edited" badge clickable in PostHeader. EditHistoryDialog shows previous versions with timestamps.

Build compiles successfully (no errors).

## Loop Control
STOP
