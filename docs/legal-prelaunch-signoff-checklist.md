# Pre-Launch Legal Review Sign-Off Checklist

Updated: March 8, 2026

This internal checklist turns the March 8, 2026 privacy/legal review into a launch gate for legal,
product, and engineering. It is based on the current implementation and policy copy in the repo
today.

Production sign-off status: Blocked until every open launch blocker below is resolved or explicitly
accepted by the launch approver.

## Evidence Pack

- `docs/legal-data-flow-map.md`
- `docs/legal-cookie-storage-audit.md`
- `src/components/legal/PrivacyPolicy.js`
- `src/components/legal/TermsOfService.js`
- `src/components/legal/CookiePolicy.js`
- `src/components/legal/CookieConsent.js`
- `src/convex/users.ts`

## Open Launch Blockers

- [ ] Replace the demo-only disclaimers in the privacy, terms, and cookie pages. The current pages
      still say the documents are for informational purposes and are not legal advice.
- [ ] Replace placeholder contact emails (`privacy@turtlein.example`, `legal@turtlein.example`)
      with production inboxes owned by the operator.
- [ ] Define the production operator legal entity and governing-law/jurisdiction text. The Terms of
      Service currently leaves jurisdiction unspecified.
- [ ] Disclose company/admin processing or limit that feature before launch. Current legal copy does
      not fully cover company records, creator/admin relationships, or company follower analytics.
- [ ] Fix or operationally mitigate dangling `companies.createdBy` and `companies.admins`
      references that can remain after `users.deleteAccount`.
- [ ] Confirm whether backups, logs, provider-held auth data, or legal-hold processes create
      retention exceptions outside the live app database. If they do, update the policies to say
      so explicitly.
- [ ] Decide whether the cookie banner should keep the future analytics preference toggle. If it
      stays, legal must approve the current wording that it stores a preference only and does not
      enable analytics tracking today.

## Code-Verified Items Ready For Review

- [x] Auth, profile, messaging, and notification disclosures were matched to current Convex data
      flows and updated in the Privacy Policy.
- [x] Privacy and Terms copy now reflects that the in-app deletion flow is a broad hard-delete
      cascade and can remove full message threads.
- [x] Cookie disclosures cover localStorage-backed auth tokens, short-lived Google/GitHub OAuth
      security cookies, recent-search storage, and consent-state storage.
- [x] Current privacy/cookie copy consistently says TurtleIn does not currently deploy analytics or
      advertising cookies in the live app.

## Reviewer Checklist

### Data Inventory And Policy Scope

- [x] Internal data-flow map reviewed against the current codebase.
- [ ] Confirm the launch copy sufficiently covers articles, poll votes, hashtags, uploaded media,
      company-authored posts, mentions, and connections-only visibility.
- [ ] Confirm whether recommendation or suggestion use of connection, follow, and company-follow
      data needs more explicit disclosure before launch.

### Deletion And Retention

- [x] `users.deleteAccount` reviewed against the schema and current legal text.
- [ ] Resolve or clearly document company-reference persistence after account deletion.
- [ ] Confirm the retention position for backups, logs, and provider infrastructure outside the
      live application database.

### Cookies And Browser Storage

- [x] Actual cookies/localStorage keys inventoried and matched to current policy text.
- [x] Current policies no longer claim theme or dark-mode persistence that is not implemented.
- [ ] Counsel approves the dormant analytics-preference wording in the consent UI, or product
      removes that toggle before launch.

### Operational Legal Metadata

- [ ] Replace demo disclaimers and example contacts with production-approved details.
- [ ] Confirm operator name, contact channel, and governing law/jurisdiction.
- [ ] Confirm whether separate vendor/subprocessor, DPA, or transfer-disclosure materials are
      required for Convex, Vercel, Google, and GitHub.

## Sign-Off Record

- Legal reviewer:
- Engineering reviewer:
- Product owner:
- Decision: `Approved` / `Blocked`
- Decision date:
- Notes:
