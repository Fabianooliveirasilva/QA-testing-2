# Example — Test Result Analyzer

Prompt: [test-result-analyzer.md](../prompts/test-result-analyzer.md).

This is a **real** failure from this project's history (2026-11-17), when the first versions of the logout and Reset App State tests were run.

## Input given to the prompt

**PLAYWRIGHT_OUTPUT** (verbatim from the run):

```text
Running 23 tests using 4 workers
  2 failed
    [chromium] › tests/cart.spec.ts:74:3 › Cart › the cart survives logout and login (CART-017)
    [chromium] › tests/cart.spec.ts:83:3 › Cart › Reset App State empties the cart and restores the buttons (CART-019)
  21 passed (34.6s)

Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('link', { name: 'Logout' })
   at ../pages/InventoryPage.ts:65
```

Page snapshot at the time of failure (from `error-context.md`, excerpt):

```yaml
- navigation:
    - button "All Items"
    - button "Dynamic Catalog"
    - link "About"
    - button "Logout"
    - button "Reset App State"
```

**CONTEXT:** the two tests are new; the same 3 runs reproduced the failure each time; the other 21 tests pass.

## AI answer (draft)

### EVIDENCE
- 21 passed, 2 failed, same two tests in every run; both open the side menu and click an item in it.
- The error is a 30 s timeout waiting for `getByRole('link', { name: 'Logout' })`.
- The page snapshot lists "Logout" and "Reset App State" with the role **button**; only "About" is a link.

### HYPOTHESES (ranked)
1. **Test defect (locator role) — most likely.** The page objects look for `link`, but the elements are buttons. Supported by the snapshot;
   it would be disproved if a `link` named "Logout" existed.
2. Timing — the menu may not have finished opening. Weaker: the menu items are already present in the snapshot, and the failure is deterministic across runs.
3. Product defect — improbable: the menu items exist and are visible.

### Next diagnostic steps
1. Change the role to `button` in the two helper methods and rerun only these tests.
2. If they still fail, open the trace and check whether the menu is visible when the click is attempted.

### Pattern
Both failures use the same menu and the same helper code; they share one cause.

### Not classified
No failure is declared a product defect.

## Outcome (recorded after a human acted on it)

Hypothesis 1 was confirmed: changing `link` to `button` in `pages/InventoryPage.ts` made all 23 tests pass in 3 consecutive runs.
The cause was a **test defect**, not a product defect.

## Human review

| Check | Status |
|-------|--------|
| Evidence quoted verbatim, nothing invented | Done |
| Hypothesis checked by rerunning the tests | Done — confirmed as above |
