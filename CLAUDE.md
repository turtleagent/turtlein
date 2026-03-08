# TurtleIn — LinkedIn Clone

A full-featured LinkedIn clone built with React + Convex + Vercel. Originally "LinkedOut" → "Bíbr In" → now "TurtleIn".

## Tech Stack
- **Frontend:** React 18, Material-UI v4, lucide-react icons, react-router-dom
- **Backend:** Convex (real-time database + serverless functions)
- **Auth:** Convex Auth (Google OAuth)
- **Deploy:** Vercel (frontend) + Convex Cloud (backend)
- **Styling:** Plus Jakarta Sans, CSS-in-JS via makeStyles, design tokens

## Current Task
Finalize production rollout wiring: move from dev Convex backend to prod Convex backend, set production env vars, and add custom domain.

## End Goal with Specs
Full LinkedIn-like professional networking platform with profiles, posts, connections, messaging, companies, notifications, and polished UI/UX.

## Roadmap (Completed)

### Phase 1 — Core Platform (Items 1–15) ✅
- Auth, profiles, posts, likes, comments, connections, messaging
- Notifications, onboarding, company pages, dark mode, responsive design
- Visual polish: Plus Jakarta Sans, design tokens, lucide-react icons
- LinkedIn-style Me dropdown, modal post composer

### Phase 2 — Rich Posts & Feed (Items 16–35) ✅
- Image upload + multi-image grid (1/2/3/4 layouts)
- URL linkification in posts
- Reaction picker (Like/Love/Celebrate/Insightful/Funny) + counts
- Reposts with commentary + repost count
- Clickable #hashtags + hashtag feed page
- @mention autocomplete in posts & comments
- Post visibility (Public / Connections Only)
- Feed sort tabs: Recent / Top / Following
- Follow system + follower counts
- Infinite scroll pagination
- Polls with voting + percentage results
- Articles (editor + full-page view)
- Bookmarks/saved posts
- Report post
- Edit history with "Edited" badge

## Roadmap (Upcoming)

### Phase 3 — Company Pages Enhancement (Items 36–55)
- Company admin dashboard
- Company analytics
- Company job postings
- Job application flow
- Company updates/news feed
- Company follower engagement
- Company page SEO
- Company verification flow
- Multi-admin management
- Company branding customization

### Phase 4 — Search & Discovery (Items 56–70)
- Global search (people, posts, companies)
- Search filters and facets
- People suggestions / "People you may know"
- Trending topics
- Content recommendations

### Phase 5 — Polish & Production (Items 71–80)
- Performance optimization
- Accessibility audit
- Mobile responsive polish
- SEO meta tags
- Error boundaries and fallbacks
- Analytics integration
- Rate limiting
- Content moderation tools

## Backlog
- [ ] Create/configure Convex production deployment and verify auth providers/callbacks <- current
- [ ] Set Vercel Production env vars to Convex prod (`REACT_APP_CONVEX_URL`, `REACT_APP_CONVEX_SITE_URL`)
- [ ] Redeploy frontend (`npx vercel --prod`) and validate login/auth redirects
- [ ] Map custom domain in Vercel and update DNS records
- [ ] Re-run smoke tests on custom domain (auth, feed, profile, messaging)
- [ ] Document final dev vs prod environment matrix in README/docs

## Dev/Prod Status
- Current frontend: Vercel production deployments exist.
- Current backend: Convex is configured to `dev` deployment (`tough-mosquito-145`).
- Current auth callback host: Convex site URL from env (`*.convex.site`), which users may see during auth flow.
- Current custom domain: not configured for TurtleIn.

## Next Steps (Prod Rollout)
1. Create/select Convex production deployment for project `turtlein`.
2. Set `REACT_APP_CONVEX_URL` and `REACT_APP_CONVEX_SITE_URL` in Vercel Production to prod values.
3. Run `npx convex deploy` against prod and verify schema/functions.
4. Run `npx vercel --prod` and verify app uses prod Convex URLs.
5. Attach custom domain in Vercel and point DNS.
6. Verify complete auth flow and user journeys on custom domain.

## Architecture Notes
- All Convex functions in `src/convex/` (schema.ts, posts.ts, users.ts, likes.ts, follows.ts, etc.)
- Components organized by feature: `src/components/{posts,form,sidebar,widgets,header,profile,company,messaging,...}`
- Routing: react-router-dom with pattern matching in App.js (no nested routes)
- State: Convex reactive queries + local React state (no Redux)
