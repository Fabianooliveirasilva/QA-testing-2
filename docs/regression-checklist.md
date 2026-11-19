# Regression Test Checklist

Run before each release or after changes to login, inventory, cart or checkout.
Tick manually; "Auto" items are covered by `npm test`, which should run first.

## Smoke (always)

- [x] Auto — `standard_user` can log in (TC-001)
- [x] Auto — Locked and invalid users are rejected (TC-002, TC-003)
- [x] Auto — Six products are listed with correct names and prices (TC-004)
- [x] Auto — Add and remove products update badge and cart (TC-006, TC-007)
- [x] Auto — Checkout validation messages appear (TC-008)
- [x] Auto — Complete checkout, totals consistent, cart cleared (TC-009, TC-010, CART-026)

## Login

- [x] Error message can be dismissed and a retry succeeds
- [x] Logout returns to the login page; protected URLs are denied when logged out (CART-008, automated)

## Inventory

- [x] Auto — All four sort options (TC-005)
- [x] Product detail page opens; Add to cart works from it (CART-007)

## Cart

- [x] Auto — Cart survives reload and logout/login (CART-016, CART-017)
- [x] Auto — Reset App State clears cart and buttons (CART-019)
- [x] Continue Shopping keeps the cart (CART-006)
- [x] Badge consistent across pages (CART-025)

## Checkout

- [x] Cancel on step one returns to the cart
- [x] Empty cart and whitespace-only data behaviour unchanged or fixed (BUG-001, BUG-002)

## Exploratory (time-boxed, 20 minutes)

- [x] `problem_user`, `error_user`, `visual_user` — compare with `standard_user` (TC-011)

## Sign-off

- Build / date: 2026-11-18
- Tester: Fabiano Oliveira
- Result: Pass
- Open defects: BUG-001 a BUG-010
