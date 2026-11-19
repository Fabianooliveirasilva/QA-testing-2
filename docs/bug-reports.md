# Bug Reports

Reports below record **observed behaviour** on the public demo site on 2026-11-17.
SauceDemo has no specification, so the expected result is a QA judgement. Each report needs human
triage before being treated as a confirmed defect. Severity and priority are rated separately.
Triage was completed on 2026-11-18; the final status of each report is in its **Status** line.

## Template

```markdown
### BUG-XXX — <short, specific title>
- **Status:** New | Confirmed | Confirmed (by design) | Needs info | Rejected | Fixed
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
- **Status:** Confirmed (triaged 2026-11-18; reproduced manually, no specification available)
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
- **Status:** Confirmed (triaged 2026-11-18; reproduced manually)
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
- **Status:** Needs info (triaged 2026-11-18; likely intentional behaviour of a demo user, and the outcome varied with the click sequence)
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

## Exploratory findings — `error_user` and `visual_user` (2026-11-17)

Both users are demo profiles designed to misbehave, so these are recorded as exploratory evidence against the
`standard_user` baseline. Environment for all: Chromium (Playwright), Linux, https://www.saucedemo.com/, 1280x800.
Status for every report: Confirmed (by design) (triaged 2026-11-18; behaviour reproduced, demo profile built to misbehave).

### BUG-004 — `error_user`: sorting has no effect and shows a "Sorting is broken" alert
- **Severity:** Medium  **Priority:** P3  **Related:** TC-011, TC-005
- **Steps:** 1. Log in as `error_user`. 2. Select "Price (low to high)" (the same happens with the other options).
- **Expected:** Products are reordered (first price $7.99).
- **Actual:** A browser alert appears ("Sorting is broken! This error has been reported to Backtrace."); the list keeps its original order (first price $29.99).
- **Evidence:** [screenshot](evidence/error_user-1-sort-has-no-effect.png). The alert text was captured with a dialog listener; Playwright dismisses dialogs automatically, so they are invisible in plain runs.

### BUG-005 — `error_user`: add/remove from the inventory fails silently for some products
- **Severity:** High  **Priority:** P3  **Related:** TC-011, TC-006, TC-007
- **Steps:** 1. Click "Add to cart" on every product once. 2. Click the toggle on Backpack, Bike Light and Onesie again to remove them.
- **Expected:** All six are added (badge 6); the removals empty those products from the cart.
- **Actual:** Bolt T-Shirt, Fleece Jacket and Red T-Shirt stay on "Add to cart" (badge 3 after six clicks). Backpack, Bike Light and Onesie stay on "Remove" and the badge does not decrease. No message is shown.
- **Evidence:** [screenshot after add then remove of Backpack](evidence/error_user-2-add-remove-inconsistent.png) (button still "Remove", badge 1).
- **Hypotheses (unconfirmed):** The same three products fail to add for `problem_user` (BUG-003), so the failure may depend on the product, not on the user.

### BUG-006 — `error_user`: last name is not kept and checkout continues with it empty
- **Severity:** High  **Priority:** P3  **Related:** TC-011, TC-008
- **Steps:** 1. Add a product, open checkout. 2. Type "Ana", "Silva", "12345". 3. Click Continue.
- **Expected:** "Silva" stays in Last Name; an empty last name would be rejected.
- **Actual:** The Last Name field is empty after typing, yet Continue opens "Checkout: Overview" with no error.
- **Evidence:** [screenshot](evidence/error_user-3-last-name-not-kept.png).

### BUG-007 — `error_user`: Finish does not complete the order
- **Severity:** High  **Priority:** P3  **Related:** TC-011, TC-009
- **Steps:** 1. Reach "Checkout: Overview" as `error_user`. 2. Click Finish.
- **Expected:** "Checkout: Complete!" with the confirmation message.
- **Actual:** The page stays on "Checkout: Overview"; no error message or alert is shown.
- **Evidence:** [screenshot](evidence/error_user-4-finish-does-not-complete.png).

### BUG-008 — `visual_user`: inventory prices are wrong and change on every load
- **Severity:** High  **Priority:** P3  **Related:** TC-011, TC-004
- **Steps:** 1. Log in as `visual_user` and note the prices. 2. Reload the page. 3. Add Backpack and open the cart.
- **Expected:** Prices match the catalog ($29.99, $9.99, $15.99, $49.99, $7.99, $15.99) and never change.
- **Actual:** Prices differ from the catalog and change on each load (first load `$91.71, $21.88, $59.96, $63.8, $36.75, $22.26`, after reload `$51.48, $40.93, $59.85, $21.53, $15.14, $28.33`). The cart shows Backpack at the catalog price $29.99, so the inventory and cart disagree. Sorting by price also uses these random values.
- **Evidence:** [visual_user inventory](evidence/visual_user-1-inventory-wrong-prices.png) next to the [standard_user reference](evidence/visual_user-0-reference-standard-inventory.png).

### BUG-009 — `visual_user`: cart icon and Checkout button are misplaced
- **Severity:** Low  **Priority:** P3  **Related:** TC-011
- **Steps:** 1. Log in as `visual_user`, add a product. 2. Open the cart.
- **Expected:** Same layout as `standard_user` (cart icon at the top-right corner of the header, Checkout button below the item list).
- **Actual:** The cart icon sits lower and further left than the baseline (bounding box `1034,39,42,42` vs `1220,10,40,40`). On the cart page the Checkout button is at the very top of the page, outside the header area and away from the item list (bounding box `1060,0` vs `1045,606` for `standard_user` with two items).
- **Evidence:** [screenshot](evidence/visual_user-2-cart-layout.png).

## Additional finding — coverage gap verification (2026-11-18)

Found while verifying gap 3 of the [Coverage Analyzer example](../ai/examples/coverage-analyzer-example.md) with a Playwright
script. Status: Confirmed (triaged 2026-11-18; see each report).

### BUG-010 — Checkout steps can be skipped by opening the Overview URL directly
- **Status:** Confirmed (triaged 2026-11-18; reproduced manually)
- **Severity:** Medium
- **Priority:** P2
- **Environment:** Chromium (Playwright), Linux, https://www.saucedemo.com/, `standard_user`, 2026-11-18
- **Related test case:** CART-009, CART-010 (related to BUG-001)
- **Preconditions:** Logged in as `standard_user`; no customer information entered.
- **Steps to reproduce:**
  1. Add "Sauce Labs Backpack" to the cart (or leave the cart empty).
  2. Without opening the cart or the information step, go directly to `https://www.saucedemo.com/checkout-step-two.html`.
  3. Click Finish.
- **Expected result:** The user is redirected to the information step (or the cart), and an order cannot be completed without first name, last name and postal code.
- **Actual result:** "Checkout: Overview" opens (Total $32.39 with the Backpack, $0.00 with an empty cart) and Finish leads to "Checkout: Complete!" / "Thank you for your order!" with no customer data.
- **Evidence:** [Overview opened by URL](evidence/BUG-010-1-overview-opened-directly.png), [order completed](evidence/BUG-010-2-order-completed.png) (captured 2026-11-18 with a Playwright script). Logged-out access to both checkout URLs is correctly denied (gap 2 discarded).
- **Notes / hypotheses (unconfirmed):** The application seems to check only for a logged-in session, not for completion of the previous step. Distinct from BUG-001, which concerns the normal flow with an empty cart.

### BUG-011 — Browser Back after an order reopens the Overview and lets a second, empty order be completed
- **Status:** Confirmed (triaged 2026-11-18; reproduced manually)
- **Severity:** Medium
- **Priority:** P3
- **Environment:** Chromium (Playwright), Linux, https://www.saucedemo.com/, `standard_user`, 2026-11-18
- **Related test case:** CART-026, CART-020 (browser Back); related to BUG-001 and BUG-010
- **Preconditions:** Logged in as `standard_user`; one product in the cart.
- **Steps to reproduce:**
  1. Add "Sauce Labs Backpack", open the cart, click Checkout, fill First Name, Last Name and Zip/Postal Code, click Continue.
  2. Click Finish and wait for "Thank you for your order!".
  3. Click the browser Back button.
  4. Click Finish again.
- **Expected result:** After the order is complete, Back does not reopen an active checkout step (redirect to the cart or inventory), and no second order can be placed from an empty cart.
- **Actual result:** Back opens "Checkout: Overview" with no items (Item total $0, Total $0.00), and Finish shows "Thank you for your order!" again.
- **Evidence:** [Overview reopened by Back](evidence/BUG-011-1-back-shows-empty-overview.png), [second order completed](evidence/BUG-011-2-second-order-completed.png) (captured 2026-11-18 with a Playwright script).
- **Notes / hypotheses (unconfirmed):** The Overview page is rendered from the (now empty) cart without checking that checkout is still in progress. Same root family as BUG-001 and BUG-010; it may be fixed together with them.
