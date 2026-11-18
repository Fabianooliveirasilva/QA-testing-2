# Test Execution Report

| Field | Value |
|-------|-------|
| Date | 2026-11-17 |
| Application | https://www.saucedemo.com/ |
| Environment | Chromium (Playwright 1.65.1, desktop viewport), Linux |
| Executed by | Automated suite + scripted exploratory checks (reviewed by QA) |
| Build / version | Not available (public demo, no version published) |

## 1. Automated execution (evidence: Playwright output)

| Metric | Result |
|--------|--------|
| Tests | 23 |
| Passed | 23 |
| Failed / flaky / skipped | 0 / 0 / 0 |
| Duration | about 10 s (4 workers) |
| Stability | 3 consecutive full runs of the final suite, all 23 passed (the first 13-test suite was also run 4 times) |
| Failure capture check | A deliberately failing temporary test produced a screenshot, a trace and an error context file; the temporary test was removed afterwards |

## 2. Manual / scripted case status

Status meanings: **Pass** = executed and matched the expectation; **Fail** = executed, did not match (defect raised);
**Not executed** = not run in this cycle.

| ID | Status | Basis |
|----|--------|-------|
| TC-001 | Pass | Automated |
| TC-002 | Pass | Automated |
| TC-003 | Pass | Automated |
| TC-004 | Pass | Automated |
| TC-005 | Pass | Automated, all four sort options |
| TC-006 | Pass | Automated |
| TC-007 | Pass | Automated |
| TC-008 | Pass | Automated |
| TC-009 | Pass | Automated |
| TC-010 | Pass | Automated |
| TC-011 | Partial | `problem_user` explored (BUG-003); `error_user` and `visual_user` not executed |
| CART-001, 002, 004, 005, 008, 011, 012, 014, 015, 016, 017, 019, 024, 026, 027 | Pass | Automated |
| CART-003, 006, 007, 013, 018, 020, 021, 022, 025 | Pass | Observed on the live site on 2026-11-17 through exploratory scripts |
| CART-009, 010, 023 | Fail | Behaviour differs from the QA judgement; see BUG-001, BUG-002, BUG-003 |

## 3. Defects

| ID | Title | Severity | Priority | Status |
|----|-------|----------|----------|--------|
| BUG-001 | Checkout accepts an empty cart and completes a $0.00 order | Medium | P2 | New |
| BUG-002 | Checkout accepts whitespace-only customer information | Low | P3 | New |
| BUG-003 | `problem_user`: identical images and some products cannot be added | Medium | P3 | New |

## 4. Limitations

- SauceDemo has no specification, so BUG-001 to BUG-003 are judgement-based and need triage.
- Only Chromium was executed; Firefox and WebKit were not.
- Exploratory findings were captured with scripts; screenshots are in `docs/evidence/`. The BUG-003 outcome varied between click sequences and needs a manual re-check.
- Observations were made on one date; the public demo can change without notice.

## 5. Conclusion

The automated regression suite is green and stable. Three observations were raised for triage. No release decision is implied:
this is a portfolio exercise against a public demo.
