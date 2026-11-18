# Example — Bug Report Assistant

Prompt: [bug-report-assistant.md](../prompts/bug-report-assistant.md). Result published as BUG-001 in
[docs/bug-reports.md](../../docs/bug-reports.md).

## Input given to the prompt

**RAW_NOTES** (copied from the exploratory session, unedited):

```text
logged in as standard_user, cart was empty (0 items in cart list)
clicked Checkout -> went to checkout-step-one anyway
filled A / B / 1 and clicked Continue -> overview page, "Total: $0.00"
clicked Finish -> "Thank you for your order!"
```

**ENVIRONMENT:** Chromium (Playwright), Linux, https://www.saucedemo.com/, `standard_user`, 2026-11-17

**EVIDENCE:** none stored at the time (screenshots were captured later)

## AI answer (draft)

### Bug report draft — Checkout accepts an empty cart and completes a $0.00 order

**Steps to reproduce** (only steps present in the notes)
1. Log in as `standard_user` with an empty cart.
2. Open the cart and click Checkout.
3. Enter First name "A", Last name "B", Postal code "1" and click Continue.
4. Click Finish.

**Expected (JUDGEMENT — no requirement was provided):** checkout is blocked or the user is warned that the cart is empty.
**Actual (EVIDENCE from notes):** overview shows "Total: $0.00"; Finish ends with "Thank you for your order!".

**Suggested severity / priority (suggestion only)**
- Severity: Medium — no data loss, but the system creates a meaningless order.
- Priority: P2 — easy to hit, easy to fix.

**Hypotheses (unconfirmed):** cart validation may be missing on purpose in this demo.

**Open questions**
- Is there a requirement that an empty cart must block checkout?
- Does the same happen for every user and browser?
- No screenshot or trace was provided (`NOT PROVIDED`).

## Human review

| Check | Status |
|-------|--------|
| Steps reproduced on the live site | Done — reproduced again and screenshots captured (see BUG-001 evidence) |
| Expected result is a judgement, labelled as such | Done |
| Severity and priority decided | Pending — the draft proposes Medium/P2; the project owner must triage |
| Final approval | Pending |
