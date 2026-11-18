# Test Cases

Conventions:
- **Priority** = urgency of running/fixing (P1 high, P2 medium, P3 low). **Severity** = impact if the case fails (Critical/High/Medium/Low). They are independent.
- **Type** = Positive, Negative or Exploratory.
- **Automation** links to the Playwright spec that covers the case, or "Manual".
- Test data: see `test-data/`. Standard login: `standard_user` with the public demo password.

## Part 1 — Core functional cases

### TC-001 — Valid login
- **Priority / Severity / Type:** P1 / Critical / Positive
- **Preconditions:** Login page open; user is logged out.
- **Steps:** 1. Enter `standard_user` and the demo password. 2. Click Login.
- **Expected:** User lands on `/inventory.html` and sees the "Products" page.
- **Automation:** `tests/login.spec.ts` — standard user can log in

### TC-002 — Invalid login
- **Priority / Severity / Type:** P1 / High / Negative
- **Preconditions:** Login page open.
- **Steps:** 1. Enter `standard_user` with a wrong password. 2. Click Login. 3. Repeat with empty fields.
- **Expected:** User stays on the login page. Wrong password: "Epic sadface: Username and password do not match any user in this service". Empty fields: "Epic sadface: Username is required".
- **Automation:** `tests/login.spec.ts` — wrong password / empty credentials

### TC-003 — Locked user
- **Priority / Severity / Type:** P1 / High / Negative
- **Preconditions:** Login page open.
- **Steps:** 1. Enter `locked_out_user` and the demo password. 2. Click Login.
- **Expected:** Login is refused with "Epic sadface: Sorry, this user has been locked out."
- **Automation:** `tests/login.spec.ts` — locked out user

### TC-004 — Product inventory
- **Priority / Severity / Type:** P1 / High / Positive
- **Preconditions:** Logged in as `standard_user`.
- **Steps:** 1. Open the product list. 2. Review names, prices, images and buttons.
- **Expected:** Six products are listed, each with name, description, price, image and an "Add to cart" button, matching `test-data/products.json`.
- **Automation:** `tests/inventory.spec.ts` — shows all six products

### TC-005 — Product sorting
- **Priority / Severity / Type:** P2 / Medium / Positive
- **Preconditions:** Logged in; product list open.
- **Steps:** 1. Select each sort option: Name (A to Z), Name (Z to A), Price (low to high), Price (high to low).
- **Expected:** The list is reordered according to the selected option each time.
- **Automation:** `tests/inventory.spec.ts` — sorting by price (low to high). Other options: Manual.

### TC-006 — Add product to cart
- **Priority / Severity / Type:** P1 / Critical / Positive
- **Preconditions:** Logged in; cart empty.
- **Steps:** 1. Click "Add to cart" on two products. 2. Open the cart.
- **Expected:** Buttons change to "Remove", badge shows 2, and the cart lists both products with quantity 1.
- **Automation:** `tests/cart.spec.ts` — adding products

### TC-007 — Remove product
- **Priority / Severity / Type:** P1 / High / Positive
- **Preconditions:** Cart contains two products.
- **Steps:** 1. Open the cart. 2. Click Remove on one product. 3. Remove the other.
- **Expected:** The list and badge update after each removal; after the last removal the cart is empty and the badge is hidden.
- **Automation:** `tests/cart.spec.ts` — removing a product / removing the last product

### TC-008 — Empty checkout fields
- **Priority / Severity / Type:** P1 / High / Negative
- **Preconditions:** Cart contains a product; checkout information page open.
- **Steps:** 1. Click Continue with all fields empty. 2. Fill only first name, Continue. 3. Add last name, Continue.
- **Expected:** Errors in order: "Error: First Name is required", "Error: Last Name is required", "Error: Postal Code is required". The user stays on the information page.
- **Automation:** `tests/checkout.spec.ts` — blocks checkout when information is incomplete (all three fields)

### TC-009 — Successful checkout
- **Priority / Severity / Type:** P1 / Critical / Positive
- **Preconditions:** Cart contains Backpack and Bike Light.
- **Steps:** 1. Checkout. 2. Enter valid information, Continue. 3. Click Finish.
- **Expected:** Confirmation "Thank you for your order!" is shown and the cart badge disappears.
- **Automation:** `tests/checkout.spec.ts` — completes an order

### TC-010 — Order summary validation
- **Priority / Severity / Type:** P1 / High / Positive
- **Preconditions:** Cart contains Backpack ($29.99) and Bike Light ($9.99); on the overview page.
- **Steps:** 1. Compare the listed items with the cart. 2. Check item total, tax and total.
- **Expected:** Item total is $39.98; total equals item total plus tax (observed: tax $3.20, total $43.18); payment and shipping information are shown.
- **Automation:** `tests/checkout.spec.ts` — consistent totals (item total and total = item total + tax)

### TC-011 — Exploratory: demo users with known issues
- **Priority / Severity / Type:** P3 / Medium / Exploratory
- **Charter:** Explore `problem_user`, `error_user` and `visual_user` through login, cart and checkout to find behaviour that differs from `standard_user`.
- **Notes:** Findings go to [bug-reports.md](bug-reports.md). See BUG-003 for the first result.
- **Automation:** Manual

## Part 2 — Shopping cart cases (AI-assisted design)

Generated with the [Test Case Generator prompt](../ai/prompts/test-case-generator.md), then reviewed by a human.
**Verification** shows how each expected result was confirmed:
**Automated** (covered by a passing Playwright spec), **Observed 2026-11-17** (checked manually/by script on the live site),
**Judgement** (no specification exists; expected result is a QA recommendation) or **Not yet verified**.

| ID | Title | Type | Preconditions | Steps | Expected result | Priority | Verification |
|----|-------|------|---------------|-------|-----------------|----------|--------------|
| CART-001 | Add one product | Positive | Logged in, empty cart | 1. Click Add to cart on one product | Button becomes Remove; badge shows 1 | P1 | Automated |
| CART-002 | Add several products | Positive | Logged in, empty cart | 1. Add Backpack and Bike Light 2. Open cart | Badge 2; cart lists both | P1 | Automated |
| CART-003 | Cart item details | Positive | Cart has 1 product | 1. Open cart | Name, description, price and quantity 1 are shown | P2 | Observed 2026-11-17 |
| CART-004 | Remove from cart page | Positive | Cart has 2 products | 1. Open cart 2. Click Remove on one | Item disappears; badge shows 1 | P1 | Automated |
| CART-005 | Remove from inventory page | Positive | Cart has 1 product | 1. Click Remove on the inventory page | Button returns to Add to cart; badge hidden | P2 | Not yet verified |
| CART-006 | Continue Shopping | Positive | Cart has 1 product, cart open | 1. Click Continue Shopping | Inventory opens; cart content unchanged | P2 | Observed 2026-11-17 |
| CART-007 | Add from product detail page | Positive | Logged in | 1. Open a product 2. Click Add to cart | Badge shows 1; button reflects the state on return to inventory | P2 | Observed 2026-11-17 |
| CART-008 | Cart requires login | Negative | Logged out | 1. Open `/cart.html` directly | Access denied: "You can only access '/cart.html' when you are logged in." | P1 | Observed 2026-11-17 |
| CART-009 | Checkout with empty cart | Negative | Logged in, empty cart | 1. Open cart 2. Click Checkout 3. Enter valid data 4. Continue, Finish | Checkout should be blocked or warn that the cart is empty. **Observed:** flow continues to a $0.00 order and completes — see BUG-001 | P2 | Judgement (fails) |
| CART-010 | Whitespace-only checkout data | Negative | Cart has 1 product, checkout open | 1. Enter only spaces in all three fields 2. Continue | Validation error. **Observed:** accepted, overview shown — see BUG-002 | P3 | Judgement (fails) |
| CART-011 | Empty cart state | Boundary | Logged in, empty cart | 1. Open cart | Empty list, no badge, Checkout and Continue Shopping available | P2 | Automated |
| CART-012 | Minimum quantity (1 item) | Boundary | Empty cart | 1. Add one product | Badge shows exactly 1 | P2 | Automated |
| CART-013 | Maximum catalog (6 items) | Boundary | Empty cart | 1. Add all six products | Badge shows 6 | P2 | Observed 2026-11-17 |
| CART-014 | Remove last item | Boundary | Cart has 1 product | 1. Remove it | Cart empty; badge hidden | P1 | Automated |
| CART-015 | Quantity stays at 1 | Boundary | Empty cart | 1. Add and remove the same product 5 times 2. Add once more | Quantity is 1; badge 1; no duplicates | P3 | Not yet verified |
| CART-016 | Cart survives reload | Edge | Cart has 6 items | 1. Reload the page | Badge still 6 | P2 | Observed 2026-11-17 |
| CART-017 | Cart survives logout/login | Edge | Cart has items | 1. Logout 2. Login as the same user | Badge and cart unchanged (observed) | P2 | Observed 2026-11-17 |
| CART-018 | Cart not shared between sessions | Edge | Cart has items in browser A | 1. Login in a separate browser context | Cart is empty (observed: state is stored per browser) | P3 | Observed 2026-11-17 |
| CART-019 | Reset App State | Edge | Cart has items | 1. Menu → Reset App State 2. Reload | Cart empty; all buttons show Add to cart | P2 | Observed 2026-11-17 |
| CART-020 | Items listed in the order added | Edge | Empty cart | 1. Add Onesie, then Backpack 2. Open cart | Cart order: Onesie, Backpack (observed) | P3 | Observed 2026-11-17 |
| CART-021 | Rapid double click on Add | Edge | Empty cart | 1. Double-click Add to cart | Single item; badge 1 | P3 | Not yet verified |
| CART-022 | Browser Back keeps button state | Edge | Cart has 1 product, cart open | 1. Browser Back | Inventory shows Remove for the added product | P3 | Not yet verified |
| CART-023 | `problem_user` add all products | Edge | Login as `problem_user` | 1. Click Add to cart on every product | All six are added. **Observed:** badge 3; Bolt T-Shirt, Fleece Jacket and Red T-Shirt stay on Add to cart — see BUG-003 | P3 | Observed 2026-11-17 (fails) |
| CART-024 | Sorting does not change cart | Regression | Cart has 2 products | 1. Change the sort option 2. Open cart | Cart unchanged | P3 | Not yet verified |
| CART-025 | Badge consistent across pages | Regression | Cart has 2 products | 1. Visit inventory, cart, checkout pages | Badge shows 2 on every page | P2 | Not yet verified |
| CART-026 | Order clears the cart | Regression | Cart has 2 products | 1. Complete checkout 2. Return to products | Cart empty; badge hidden; a new order can be started | P1 | Automated |
| CART-027 | Cart total matches overview | Regression | Cart has 2 products | 1. Note prices in cart 2. Continue to overview | Overview item total equals the sum of cart prices | P1 | Automated |

### Coverage note

The cart set was designed to avoid overlapping Part 1: adding, removing and checkout validation appear once as core cases
(TC-006 to TC-010) and are extended here only with boundary, edge and regression variants.
Not yet verified cases are candidates for the next manual execution cycle.
