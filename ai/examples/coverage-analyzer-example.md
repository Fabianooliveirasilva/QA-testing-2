# Example — Test Coverage Analyzer

Prompt: [test-coverage-analyzer.md](../prompts/test-coverage-analyzer.md).

## Input given to the prompt

**FEATURE:** SauceDemo shopping cart and the checkout steps that depend on it.

**EXISTING_TEST_CASES** (titles from [docs/test-cases.md](../../docs/test-cases.md), IDs CART-001 to CART-027 and TC-006 to TC-010):
add one / several products, cart item details, remove from cart and inventory pages, Continue Shopping, add from product detail page,
cart requires login, empty-cart checkout, whitespace-only checkout data, empty cart, one item, six items, remove last item, repeated
add/remove, reload, logout/login, separate sessions, Reset App State, order of items, double click, browser Back, `problem_user`,
sorting keeps the cart, badge across pages, order clears the cart, totals match.

**REQUIREMENTS:** none published; behaviour observed on 2026-11-17 (see [application analysis](../../docs/application-analysis.md)).

## AI answer (draft)

### 1. Coverage map

| Area | Covered by | Assessment |
|------|-----------|------------|
| Add / remove, badge | CART-001..005, 011..015 | Good |
| Persistence and state | CART-016..019 | Good |
| Access control | CART-008 | Only the cart page; other pages not covered |
| Checkout dependency on cart | CART-009, 026, 027 | Partial |
| Product detail page | CART-007 | Add only; remove is not covered |
| Users with known issues | CART-023 (`problem_user`) | `error_user`, `visual_user` only in TC-011 (exploratory) |
| Non-functional (accessibility, mobile, browsers) | none | Out of scope in the test plan |

### 2. Gaps (HYPOTHESES to confirm)

| # | Suggested scenario | Why it matters | Risk |
|---|--------------------|----------------|------|
| 1 | Remove a product from its detail page | Third entry point for removal, only "add" is covered | Medium |
| 2 | Direct URL access to `/checkout-step-one.html` and `/checkout-step-two.html` when logged out | Access control tested for `/cart.html` only | High |
| 3 | Open `/checkout-step-two.html` directly with an empty cart / no customer data | Could skip the information step | Medium |
| 4 | Checkout fields: very long text, special characters, non-numeric postal code (boundary) | Only empty and whitespace values are covered | Medium |
| 5 | Cancel on the overview page, then resume | Only Cancel on step one is exercised | Low |
| 6 | Browser Back/Forward inside the checkout flow | State handling between steps | Medium |
| 7 | Cart behaviour at a narrow (mobile) viewport | Layout can hide the cart badge or buttons | Low |
| 8 | Cart keyboard navigation (Tab/Enter) | Accessibility of add/remove buttons | Low |
| 9 | Two tabs open on the same session | Cart state shared through storage | Low |
| 10 | `performance_glitch_user` cart and checkout timing | Slow responses can break waits | Low |

### 3. Overlaps
- CART-004 and TC-007 both cover removal from the cart page; keep TC-007 as the main case and mark CART-004 as the variant.
- CART-026 and TC-009 both finish an order; CART-026 adds the "cart is empty afterwards" check, so keep both but cross-reference.

### 4. Not assessable
- Real business rules (maximum quantity, stock levels, tax rules): `NOT PROVIDED`.

## Human review

| Check | Status |
|-------|--------|
| Gaps are real and not already covered | Partial — all 10 gaps checked with Playwright on 2026-11-18 (see below); this is automated evidence, not a human approval, and each result still needs the owner's own check before test cases are written |
| Overlap notes make sense | Pending |
| Decision on which gaps become test cases | Pending — project owner |

### Gap verification (automated exploration, `standard_user`, 2026-11-18)

Observed on the live site with a throwaway Playwright script. This is evidence of behaviour, not a human approval.

| Gap | Observation | Verdict |
|-----|-------------|---------|
| 1 | On a product detail page, Add to cart turns the button into Remove (badge 1); Remove restores Add to cart (badge cleared, cart empty) | Confirmed as a coverage gap (no case covers it); behaviour correct, no defect |
| 2 | Logged out, `/checkout-step-one.html` and `/checkout-step-two.html` redirect to `/` with "You can only access '...' when you are logged in." | Discarded — access control works |
| 3 | Logged in, empty cart, `/checkout-step-two.html` opens directly: Overview with Total $0.00, and Finish reaches "Checkout: Complete!" | Confirmed — information step can be skipped |
| 3 (variant) | Same with 1 item (Backpack), no customer data: Overview total $32.39, Finish shows "Thank you for your order!" | Confirmed — an order completes without name or postal code |
| 4 | Checkout fields accept 500-character values, `<script>` and SQL-like text, accents, Japanese and emoji, and non-numeric postal codes (`ABCDE-xyz`, `-1 !@#`): all reach the Overview with no error and no alert dialog. Not verified: how the Overview or later pages display these values (it does not show customer data) | Confirmed — no length or format validation (judgement; no specification). Same family as BUG-002; not recorded as a bug yet |
| 5 | Cancel on the Overview opens `/inventory.html` (Cancel on step one goes to the cart); the cart keeps the Backpack (badge 1). Restarting checkout shows empty fields, and refilling then Finish completes the order | Confirmed as a coverage gap; behaviour correct, no defect. Minor inconsistency in where Cancel leads |
| 6 | Back from the Overview opens step one and Forward returns to the Overview, badge kept | Confirmed as a coverage gap; behaviour correct |
| 6 (after order) | After "Thank you for your order!", Back opens `/checkout-step-two.html` with an empty cart; Finish completes another order | Confirmed — wrong behaviour, same family as BUG-001 and BUG-010; recorded as BUG-011 in `docs/bug-reports.md` |
| 7 | At 375 px and 320 px wide: no horizontal overflow; cart badge visible; Checkout, Continue Shopping and Remove buttons visible and inside the viewport (Chromium only) | Discarded — layout adapts |
| 8 | Tab reaches Add to cart and Enter adds the product (badge 1); on the cart page Tab order is Remove, Continue Shopping, Checkout. After Enter the focus moves to `BODY`, so a following Space does nothing | Confirmed with a caveat — works by keyboard but focus is lost after toggling (hypothesis: the button element is replaced). Visible focus ring not assessed (`outline` reads `none`; other styles not checked). Not recorded as a bug yet |
| 9 | Two tabs, same session: the cart is shared through browser storage but not synchronised live. After tab A added the Backpack, tab B showed no badge until reloaded (then badge 1). Tab B removing the Backpack was seen by A after a reload. After A finished an order, B without reload still showed badge 1; after reload it was empty. With A logged out, B opening the cart was redirected to login with the access error. No data was lost | Confirmed as a coverage gap; behaviour consistent with state read on page load, a stale tab can act on old state. Observation, not recorded as a bug. One intermediate read (A's cart right after clicking the cart link) came back empty and was attributed to reading before render; not re-run |
| 10 | `performance_glitch_user`: login to inventory took 5114 ms (single run) against 78 ms for `standard_user`; add, open cart, checkout step, Continue and Finish took 42–70 ms, as for `standard_user`; the order completed | Confirmed — delay is in the login only. Expected for a demo profile designed to be slow; Playwright's default timeouts tolerate it. Single run per user, not a performance measurement |

Gap 3 is recorded as BUG-010 in `docs/bug-reports.md`. The Back-after-order finding (gap 6) is recorded as BUG-011. Both need manual reproduction and a triage decision by the project owner.
