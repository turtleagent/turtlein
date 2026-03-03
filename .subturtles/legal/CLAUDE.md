## Current Task
Create Terms of Service page component at `src/components/legal/TermsOfService.js`.

## End Goal with Specs
The site must have standard legal compliance for a consumer web app launching in the EU:

1. **Privacy Policy page** at `/privacy` — covers: what data we collect (name, email, profile photo via Google OAuth; posts, messages, connections stored in Convex), why (to provide the service), who processes it (Convex Cloud, Vercel), retention period, user rights (access, rectification, erasure, portability), contact info. GDPR-style.
2. **Terms of Service page** at `/terms` — covers: acceptance of terms, user accounts, content ownership (users own their content, grant TurtleIn license to display), prohibited conduct, limitation of liability, termination, governing law. Standard web app ToS.
3. **Cookie Policy page** at `/cookies` — covers: what cookies are used (auth session, preferences), essential vs non-essential, how to manage cookies.
4. **Cookie consent banner** — appears on first visit, bottom of screen. "We use cookies..." with Accept / Manage buttons. Stores consent in localStorage. Shows only essential cookies by default (GDPR compliant). Must not block the page.
5. **Account deletion** — add "Delete Account" button in profile settings or Me dropdown. Calls a Convex mutation that deletes user data (posts, comments, likes, connections, messages, follows, bookmarks, reports). Shows confirmation dialog first.
6. **Footer component** — appears on all pages below the main content. Links to: Privacy Policy, Terms of Service, Cookie Policy. Also shows "© 2026 TurtleIn" and small branding.
7. **Routes** — add `/privacy`, `/terms`, `/cookies` routes in App.js.

Style: use existing Material-UI + makeStyles pattern. Legal pages should be clean, readable (max-width 800px, good typography). Dark mode compatible.

## Backlog
- [x] Read App.js to understand routing pattern and where to add footer
- [x] Create Privacy Policy page component at src/components/legal/PrivacyPolicy.js
- [ ] Create Terms of Service page component at src/components/legal/TermsOfService.js <- current
- [ ] Create Cookie Policy page component at src/components/legal/CookiePolicy.js
- [ ] Create CookieConsent banner component — bottom-fixed bar, localStorage persistence, Accept/Manage buttons
- [ ] Create Footer component with legal links + copyright, add to App.js layout
- [ ] Add /privacy, /terms, /cookies routes in App.js
- [ ] Add "Delete Account" button with confirmation dialog — Convex mutation to delete all user data
- [ ] Create deleteAccount mutation in src/convex/users.ts — cascade delete posts, comments, likes, connections, messages, follows, bookmarks, reports
- [ ] Verify all pages render, dark mode works, footer shows everywhere
- [ ] Commit

## Notes
- App routing uses react-router-dom with useMatch pattern in App.js (no nested routes)
- All styling via Material-UI makeStyles + design tokens from existing codebase
- Legal text should be real and reasonable (not lorem ipsum) but include a disclaimer that it's a demo app
- Cookie consent: localStorage key `turtlein_cookie_consent` with value `accepted` or `managed`
- Account deletion Convex mutation needs to delete from: users, posts, comments, likes, reactions, connections, follows, bookmarks, reports, reposts, messages, conversations, polls/pollVotes, postEdits, hashtags
- Keep legal pages simple — no complex layouts, just well-formatted text with headings

### App.js findings (routing/layout)
- `src/App.js` has **no `<Routes>`**; `AppShell` uses `useMatch()` to detect routes and conditionally render views inside the center feed column.
- New legal pages should follow the existing pattern: add `useMatch("/privacy")`, `useMatch("/terms")`, `useMatch("/cookies")`, include them in `isSpecialRouteActive`, and add `shouldShowPrivacyView`/`shouldShowTermsView`/`shouldShowCookiesView` booleans to render the new components in the feed column (above the main tab views).
- The global layout is `ThemeProvider -> Grid.container (app) -> header + app__body (sidebar | feed | widgets)`. A site-wide footer can be added as a sibling `Grid item` after `app__body` inside the same top-level container so it appears across all authenticated views (and can be made full-width on mobile).
