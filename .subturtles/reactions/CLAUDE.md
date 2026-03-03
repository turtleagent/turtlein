## Current Task
Test reactions end-to-end (add/change/remove) and verify reaction counts stay correct, including legacy likes.

## End Goal with Specs
- Item 19: Post reactions beyond like — 👍 Like, ❤️ Love, 🎉 Celebrate, 💡 Insightful, 😂 Funny. Hover/long-press on Like button shows reaction picker popup.
- Item 20: Reaction counts per type — show small icon row under post (like LinkedIn) with counts. Hover shows breakdown tooltip.

The `reactions` table already exists in schema with `reactionType` enum (like/love/celebrate/insightful/funny). Legacy `likes` should remain compatible (treated as 👍 when no reaction exists).

## Backlog
- [x] Read Post.js, PostActions.js, likes.ts, and check if a reactions.ts file exists
- [x] Build ReactionPicker component — popup with 5 reaction emojis, appears on hover/long-press of Like button
- [x] Wire addReaction/removeReaction mutations (toggle — tap same reaction removes it)
- [x] Show reaction icon row under post: small emoji icons + total count (like LinkedIn's 👍❤️🎉 42)
- [x] Hover tooltip on reaction row shows per-type breakdown
- [x] Ensure backward compatibility — existing likes should still work or be treated as 👍 reactions
- [ ] Test: add reaction, change reaction, remove reaction, verify counts <- current
- [ ] Commit

## Notes
- Key files: `src/components/posts/post/PostActions.js`, `src/components/posts/post/Post.js`
- Convex backend: `src/convex/likes.ts` handles legacy likes + reactions
