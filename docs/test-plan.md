# Test Plan — SmartQA Lab

| Field | Value |
|-------|-------|
| System under test | SauceDemo — <https://www.saucedemo.com/> |
| Document owner | QA Engineer |
| Version | 1.0 (2026-11-17) |

## 1. Objective

Verify that the core purchase flow of SauceDemo (login, browse, cart, checkout) works as expected,
and demonstrate a combined manual, AI-assisted and automated testing approach.

## 2. Scope

**In scope:** login, product inventory and sorting, shopping cart, checkout (information, overview, completion).

**Out of scope:** performance and load testing, security testing, accessibility audit, mobile devices,
social links and third-party pages, the `performance_glitch_user` and `visual_user` profiles.

## 3. Requirements source

SauceDemo publishes no requirements. Expected results are derived from observed behaviour, common
e-commerce conventions and QA judgement. Where a result is a judgement call, the test case says so.

## 4. Test approach

| Level | Technique | Tooling |
|-------|-----------|---------|
| Manual | Scripted functional cases (positive, negative, boundary) and exploratory sessions | Browser, [test-cases.md](test-cases.md) |
| AI-assisted | Test design, coverage review, bug report drafting, result triage — always reviewed by a human | Prompts in `ai/prompts/` |
| Automated | Browser E2E regression of stable flows | Playwright + TypeScript |

## 5. Entry and exit criteria

- **Entry:** application reachable, test data available, framework installs and type-checks.
- **Exit:** all P1 cases executed; no open Critical or High defects without a documented decision;
  automated suite green on the target browser; [execution report](test-execution-report.md) completed.

## 6. Severity and priority

Severity (technical impact) and priority (business urgency to fix) are rated separately.

| Severity | Meaning |
|----------|---------|
| Critical | Core flow unusable, data loss, no workaround |
| High | Major function broken, workaround exists |
| Medium | Minor function broken or confusing behaviour |
| Low | Cosmetic or negligible |

| Priority | Meaning |
|----------|---------|
| P1 | Fix before release / blocks regression |
| P2 | Fix in the current cycle |
| P3 | Fix when capacity allows |

## 7. Environment

Chromium (Playwright default, desktop viewport) on Linux; manual checks on any current desktop browser.
No credentials are stored in the repository (see `.env.example`).

## 8. Test data

Demo users published on the login page. Data lives in `test-data/` (JSON) and the demo password is read
from `SAUCE_PASSWORD`.

## 9. Risks

| Risk | Mitigation |
|------|------------|
| Public demo may change or be unavailable | Pin expectations in data files; report drift as a finding |
| Demo users intentionally misbehave | Keep them out of the stable suite; use for exploratory testing |
| AI output may be wrong | Verify every AI-generated case against the application before relying on it |

## 10. Deliverables

[Test cases](test-cases.md), [bug reports](bug-reports.md), [execution report](test-execution-report.md),
[regression checklist](regression-checklist.md), Playwright suite and HTML report.
