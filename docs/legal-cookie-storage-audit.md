# Cookie and Browser Storage Audit

This document validates TurtleIn's current cookie and browser storage disclosures against the
implemented frontend and auth stack. It is an internal review artifact for legal copy updates, not
user-facing policy text.

## Sources Reviewed

- `src/components/legal/CookiePolicy.js`
- `src/components/legal/PrivacyPolicy.js`
- `src/components/legal/CookieConsent.js`
- `src/components/header/Header.js`
- `src/store/actions/util.js`
- `src/store/reducers/util.js`
- `src/index.js`
- `src/convex/auth.ts`
- `node_modules/@convex-dev/auth/src/react/index.tsx`
- `node_modules/@convex-dev/auth/src/react/client.tsx`
- `node_modules/@convex-dev/auth/dist/server/oauth/convexAuth.js`
- `node_modules/@convex-dev/auth/dist/server/oauth/checks.js`

## Actual Browser Storage Inventory

| Storage surface | Keys / pattern | Purpose in implementation | Notes |
| --- | --- | --- | --- |
| `localStorage` | `__convexAuthJWT_<namespace>` | Stores the Convex access token used to keep a browser session signed in. | Provided by `ConvexAuthProvider`, which defaults to `window.localStorage`. |
| `localStorage` | `__convexAuthRefreshToken_<namespace>` | Stores the Convex refresh token so the session can be renewed. | Also managed by `@convex-dev/auth`. |
| `localStorage` | `__convexAuthOAuthVerifier_<namespace>` | Stores the OAuth verifier during sign-in redirects. | Used during the auth handshake, then removed. |
| `localStorage` | `__convexAuthServerStateFetchTime_<namespace>` | Tracks server-state sync timing for auth hydration. | Internal auth bookkeeping. |
| HTTP cookies | Provider-specific OAuth cookies such as `googleOAuthpkce`, `googleOAuthstate`, `googleOAuthnonce`, `githubOAuthpkce`, `githubOAuthstate` | Stores short-lived PKCE/state/nonce values needed for Google and GitHub OAuth sign-in security checks. | Created by Convex Auth server code with a 15-minute TTL and cleared on callback. |
| `localStorage` | `turtlein_cookie_consent` | Remembers whether the user accepted or managed the cookie banner. | Written by `CookieConsent`. |
| `localStorage` | `turtlein_cookie_preferences` | Stores consent UI choices (`functional`, `analytics`). | No code path currently reads the `analytics` preference outside the consent UI itself. |
| `localStorage` | `turtlein_recent_searches` | Stores up to 5 recent search terms for the header search dropdown. | This is user-facing product data, not just a technical preference. |

## Negative Findings

- No app code was found that persists theme or dark-mode choice in cookies, `localStorage`, or
  `sessionStorage`.
- No analytics, advertising, or personalization cookies/storage writes were found in app code.
- The only "optional" storage currently implemented is the saved consent preference itself; the
  `analytics` toggle does not activate any analytics code path.

## Current Disclosure Crosswalk

| Current copy | Implementation status | Gap |
| --- | --- | --- |
| Cookie Policy section 1 says cookies and similar technologies keep users signed in. | Partially accurate. Persistent sign-in state is primarily stored in `localStorage` tokens, while cookies are used in the OAuth handshake. | Legal copy should distinguish persistent auth token storage from short-lived security cookies. |
| Cookie Policy section 3 lists "Authentication/session" storage. | Accurate but too generic. | It should explicitly disclose auth token storage in `localStorage` and the temporary OAuth cookies used for Google/GitHub sign-in. |
| Cookie Policy section 3 lists "Preferences" such as theme/dark mode. | Not supported by the current code. | This overstates preference storage and should be replaced with actual uses like recent searches and consent choices. |
| Cookie Policy section 3 mentions storing cookie-consent choices locally. | Accurate. | It should clarify that the consent UI stores banner state and preference selections in `localStorage`. |
| Cookie Policy section 4 says non-essential cookies are not currently used by default and may be added later. | Mostly accurate. | The consent banner currently offers an "Analytics" toggle even though no analytics cookies/storage are implemented, which risks implying optional tracking exists today. |
| Privacy Policy section 7 says essential cookies or local storage keep users signed in and remember preferences such as theme/dark mode. | Partially accurate. | Sign-in language should be more specific, and the theme/dark-mode example should be removed because no such persistence was found. |

## Validation Outcome

1. The current disclosures are directionally correct that TurtleIn uses essential browser storage for
   authentication and consent state, but they are not precise about how sign-in persistence works.
2. The policies under-disclose `localStorage` use for recent searches.
3. The policies overstate preference storage by naming theme/dark mode persistence that is not
   implemented.
4. The consent UI overstates optional cookies by presenting analytics choices without any matching
   analytics storage or tracking implementation.

## Recommended Drafting Changes For The Next Pass

1. Update the Cookie Policy to disclose `localStorage`-backed auth tokens, recent-search storage,
   and consent preference storage explicitly.
2. Update the Privacy Policy cookie/storage section to remove the theme/dark-mode example and align
   it with the actual auth and recent-search behavior.
3. Tighten the CookieConsent banner/manage copy so it does not imply optional analytics cookies are
   active when only consent-state storage exists today.
