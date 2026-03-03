## Current Task
Detect URLs in post description text and render as styled clickable links.

## End Goal with Specs
- Item 16: Image upload in posts — file picker in Form.js, store via Convex storage (generateUploadUrl), display in feed
- Item 17: Multi-image posts — upload up to 4 images, grid display layout (1 image = full width, 2 = side-by-side, 3-4 = 2x2 grid)
- Item 18: Link preview — detect URLs in post text, render as styled clickable links (no server-side og:tag fetching — client-side only, just make URLs clickable and visually styled)

Posts schema already has `imageStorageIds: v.optional(v.array(v.id("_storage")))`. Form.js already references imageStorageIds on line 285. The post creation flow partially supports images.

## Backlog
- [x] Read Form.js, Posts.js, Post.js, and PostActions.js to understand current image handling
- [x] Ensure file picker allows selecting 1-4 images, shows previews before posting
- [x] Upload all selected images to Convex storage, save IDs in imageStorageIds array
- [x] Display images in Post.js with responsive grid layout (1/2/3/4 image layouts)
- [ ] Detect URLs in post description text and render as styled clickable links <- current
- [ ] Test: create post with 1 image, 2 images, 4 images, and post with URL text
- [ ] Commit

## Notes
- Key files: `src/components/form/Form.js`, `src/components/posts/post/Post.js`, `src/components/posts/Posts.js`
- Convex: `src/convex/posts.ts` has createPost mutation
- Image storage uses Convex's built-in storage: `generateUploadUrl` + `getUrl`
- Do NOT add any external services or URL unfurling — just make URLs clickable styled links
