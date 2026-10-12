# BLOCKERS

Items that must be resolved before the branch can ship to production.

---

## P0 — Must fix before going live

### 1. Contact email is empty
`SITE.contact.email` is `""` in `src/config/site.ts`. The "Send an email" button
in the CTA section is hidden when blank. Add the real enquiry address.

### 2. `cta-lineup.jpg` missing
`ClosingCTA` references `/images/cta-lineup.jpg`. This file does not exist yet.
**Provide or replace with a suitable image before go-live.**
A fallback is to swap the `src` to an existing image such as `/images/workspace.jpg`.

### 3. No Playwright / reference screenshots
No reference screenshots were captured during this build. A visual diff pass
is required before sign-off.

---

## P1 — Should fix before launch

### 4. Solution images are placeholders
Several solutions in `src/config/solutions.ts` reference images that may not
exist or are reused from other sections. Supply dedicated images per solution.

### 5. Client logos — permission not confirmed
Some `CLIENT_LOGOS` entries have `permission: false`. They are already filtered
from the Trusted-by strip, but the entries should be removed or updated once
permission is confirmed.

### 6. `PARTNER.microsoft` wording
The footer reads "Apple Business Partner and Microsoft Surface Partner". Confirm
the exact approved Microsoft partner designation.

### 7. Privacy Policy and Terms of Service pages
Footer links `/privacy` and `/terms` have no corresponding pages. These will 404.
Either create the pages or remove the links.

---

## P2 — Nice to have before launch

### 8. Lighthouse audit
Run Lighthouse on the production build:
- Performance target: LCP < 2.5 s on 4G (ensure all ImagePanel images have
  correct `priority` and `sizes`).
- Accessibility: no contrast failures on pink-600 text.
- SEO: meta description present.

### 9. Colour-contrast sweep
Run `node scripts/contrast-sweep.mjs` on the production URL. Verify all text
combinations meet WCAG AA (4.5:1 for body, 3:1 for large text).

### 10. Reduced-motion parity
Test with `prefers-reduced-motion: reduce` — Hero, Services, Industries, and
Testimonials all have fallback paths; verify they render correctly.

---

*Last updated: 2026-10-09*
