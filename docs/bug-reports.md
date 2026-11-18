# Bug Reports

Reports below record **observed behaviour** on the public demo site on 2026-11-17.
SauceDemo has no specification, so the expected result is a QA judgement. Each report needs human
triage before being treated as a confirmed defect. Severity and priority are rated separately.

## Template

```markdown
### BUG-XXX — <short, specific title>
- **Status:** New | Confirmed | Rejected | Fixed
- **Severity:** Critical | High | Medium | Low
- **Priority:** P1 | P2 | P3
- **Environment:** <browser + version, OS, URL, user, date>
- **Related test case:** <ID>
- **Preconditions:** <state needed>
- **Steps to reproduce:**
  1. ...
- **Expected result:** ...
- **Actual result:** ...
- **Evidence:** <screenshot, trace, video, log — what was actually captured>
- **Notes / hypotheses (clearly labelled, unconfirmed):** ...
```

## Reports

### BUG-001 — Checkout accepts an empty cart and completes a $0.00 order
- **Status:** New (needs human triage; no specification available)
- **Severity:** Medium
- **Priority:** P2
- **Environment:** Chromium (Playwright), Linux, https://www.saucedemo.com/, `standard_user`, 2026-11-17
- **Related test case:** CART-009
- **Preconditions:** Logged in with an empty cart (use Reset App State).
- **Steps to reproduce:**
  1. Open the cart (no items).
  2. Click Checkout.
  3. Enter first name, last name and postal code; click Continue.
  4. Click Finish.
- **Expected result:** Checkout is blocked, or the user is warned that the cart is empty.
- **Actual result:** The overview shows "Total: $0.00" and the order completes with "Thank you for your order!".
- **Evidence:** [empty cart](evidence/BUG-001-1-empty-cart.png), [overview with $0.00 total](evidence/BUG-001-2-overview-zero-total.png), [order completed](evidence/BUG-001-3-order-completed.png) (captured 2026-11-17).
- **Notes / hypotheses (unconfirmed):** The demo may intentionally skip cart validation.

### BUG-002 — Checkout accepts whitespace-only customer information
- **Status:** New (needs human triage)
- **Severity:** Low
- **Priority:** P3
- **Environment:** Chromium (Playwright), Linux, https://www.saucedemo.com/, `standard_user`, 2026-11-17
- **Related test case:** CART-010
- **Preconditions:** Cart contains at least one product; checkout information page open.
- **Steps to reproduce:**
  1. Type three spaces in First Name, Last Name and Zip/Postal Code.
  2. Click Continue.
- **Expected result:** A validation error, as for empty fields.
- **Actual result:** The user proceeds to "Checkout: Overview".
- **Evidence:** [whitespace entered](evidence/BUG-002-1-whitespace-input.png), [overview shown](evidence/BUG-002-2-overview-accepted.png) (captured 2026-11-17).
- **Notes / hypotheses (unconfirmed):** Validation probably checks for an empty string without trimming input.

### BUG-003 — `problem_user`: identical product images and some products cannot be added to the cart
- **Status:** New (likely intentional behaviour of a demo user; recorded as exploratory evidence)
- **Severity:** Medium
- **Priority:** P3
- **Environment:** Chromium (Playwright), Linux, https://www.saucedemo.com/, `problem_user`, 2026-11-17
- **Related test case:** CART-023, TC-011
- **Preconditions:** Logged in as `problem_user`, empty cart.
- **Steps to reproduce:**
  1. Open the product list and compare the product images.
  2. Click "Add to cart" once on each of the six products.
- **Expected result:** Each product shows its own image; all six products are added (badge 6).
- **Actual result:** All six products show the same image. Backpack, Bike Light and Onesie change to "Remove" (badge 3); Bolt T-Shirt, Fleece Jacket and Test.allTheThings() T-Shirt (Red) stay on "Add to cart".
- **Evidence:** [inventory after the clicks](evidence/BUG-003-1-problem-user-inventory.png) (captured 2026-11-17).
- **Notes / hypotheses (unconfirmed):** An earlier exploratory run that clicked the first remaining button repeatedly ended with badge 2, so the outcome may depend on the click sequence; re-check manually.
