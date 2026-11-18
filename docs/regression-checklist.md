# Regression Test Checklist

Run before each release or after changes to login, inventory, cart or checkout.
Tick manually; "Auto" items are covered by `npm test`, which should run first.

## Smoke (always)
- [ ] Auto — `standard_user` can log in (TC-001)
- [ ] Auto — Locked and invalid users are rejected (TC-002, TC-003)
- [ ] Auto — Six products are listed with correct names and prices (TC-004)
- [ ] Auto — Add and remove products update badge and cart (TC-006, TC-007)
- [ ] Auto — Checkout validation messages appear (TC-008)
- [ ] Auto — Complete checkout, totals consistent, cart cleared (TC-009, TC-010, CART-026)

## Login
- [ ] Error message can be dismissed and a retry succeeds
- [ ] Logout returns to the login page; protected URLs are denied when logged out (CART-008, automated)

## Inventory
- [ ] Auto — All four sort options (TC-005)
- [ ] Product detail page opens; Add to cart works from it (CART-007)

## Cart
- [ ] Auto — Cart survives reload and logout/login (CART-016, CART-017)
- [ ] Auto — Reset App State clears cart and buttons (CART-019)
- [ ] Continue Shopping keeps the cart (CART-006)
- [ ] Badge consistent across pages (CART-025)

## Checkout
- [ ] Cancel on step one returns to the cart
- [ ] Empty cart and whitespace-only data behaviour unchanged or fixed (BUG-001, BUG-002)

## Exploratory (time-boxed, 20 minutes)
- [ ] `problem_user`, `error_user`, `visual_user` — compare with `standard_user` (TC-011)

## Sign-off
- Build / date: ______  Tester: ______  Result: Pass / Fail  Open defects: ______
