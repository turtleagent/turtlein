# Current task
Verify cookie/localStorage disclosures vs frontend implementation.

# End goal with specs
- Verify policy coverage for all user-data categories in the app.
- Ensure account deletion and messaging behaviors are accurately disclosed.
- Ensure cookie/local storage usage disclosures match implementation.
- Deliver updated legal copy and a compliance gap checklist.

# Roadmap (Completed)
- Initial docs inventory captured (`PrivacyPolicy`, `TermsOfService`, `CookiePolicy`).
- Core data domains identified (profiles, posts, messages, notifications, auth data).

# Roadmap (Upcoming)
- Map each data flow from code to legal text.
- Identify missing/incorrect disclosures and retention statements.
- Patch legal pages and confirm internal consistency.
- Produce final compliance readiness summary.

# Backlog
- [x] Map real data flows from Convex schema/functions to legal docs
- [x] Verify disclosure of auth/profile/message/notification processing
- [x] Verify deletion/retention statements against `deleteAccount` behavior
- [ ] Verify cookie/localStorage disclosures vs frontend implementation <- current
- [ ] Draft/patch legal text for identified gaps
- [ ] Produce sign-off checklist for pre-launch legal review
