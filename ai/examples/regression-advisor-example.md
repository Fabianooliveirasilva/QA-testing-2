# Example — Regression Test Advisor

Prompt: [regression-test-advisor.md](../prompts/regression-test-advisor.md).

> The change below is **hypothetical**, written only to demonstrate the workflow. SauceDemo publishes no release notes.

## Input given to the prompt

**CHANGE_DESCRIPTION (hypothetical):** "The cart badge counter is now calculated by a new function, and the tax rate used on the checkout overview page
was changed. Login and product pages are untouched."

**TEST_SUITE** (real; A = automated, M = manual): TC-001..004 (A), TC-005 (A), TC-006 (A), TC-007 (A), TC-008 (A), TC-009 (A), TC-010 (A),
CART-001/002/004/005/008/011/012/014/015/016/017/019/024/026/027 (A), CART-003/006/007/013/018/020/021/022/025 (M).

## AI answer (draft)

### Impacted areas
1. **Cart badge** — the counter logic changed; it appears on the inventory, cart and checkout pages.
2. **Checkout overview totals** — the tax rate changed; item total, tax and total are displayed there.
3. **Indirectly** — anything that adds, removes, resets or reloads the cart, because each one updates the badge.

### Recommended tests

| Tier | Tests | Reason |
|------|-------|--------|
| **Must run** | CART-001, 002, 004, 005, 011, 012, 014, 015 | Directly exercise the badge counter |
| **Must run** | TC-009, TC-010, CART-027 | Check totals and the tax calculation |
| **Must run** | CART-026 | Badge must clear after an order |
| **Should run** | CART-016, 017, 019, 024 | Badge after reload, logout/login, reset, sorting |
| **Should run** | CART-025 (M), CART-013 (M) | Badge consistent across pages and with six items |
| **Optional** | TC-001..005, CART-008 | Login, inventory, sorting and access control are untouched |

### Coverage gaps for this change
- **HYPOTHESIS:** TC-010 compares total with item total plus tax, so it would catch inconsistent arithmetic but **not** a wrong tax rate if both
  values are wrong together. A test with an explicit expected tax for a known cart (for example $39.98 → $3.20 as observed on 2026-11-17) would cover it.
- No test checks the badge with the maximum number of items inside the automated suite (CART-013 is manual).

### Execution order and failure handling
1. Run the automated Must-run tests first (about 10 seconds locally).
2. If a Must-run test fails, stop, open the trace, and reproduce manually before opening a bug; then run the Should-run group.

### Cannot be judged from the description
- The new tax rate and whether it applies per item or per order: `NOT PROVIDED`.

## Human review

| Check | Status |
|-------|--------|
| Test IDs exist in the suite | Done — all IDs were checked against `docs/test-cases.md` |
| The change is real | No — hypothetical, for demonstration only |
| Adding an explicit tax assertion | Implemented 2026-11-18 in `tests/checkout.spec.ts` (fixed $39.98 → $3.20 → $43.18; checked to fail when the expected tax is wrong); the owner's approval is still Pending |
