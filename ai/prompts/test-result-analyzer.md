# Prompt: Test Result Analyzer

**Purpose:** analyze Playwright execution results and suggest possible causes of failures.
**Input:** run `npm test`; then paste the console output or the failing entries of `reports/results.json`
(plus the error text from the HTML report). Do not paste real credentials.

---

## Prompt

Act as a Senior QA Automation Engineer triaging a Playwright run.

Execution evidence (paste verbatim):
{{PLAYWRIGHT_OUTPUT}}

Optional context (recent changes, environment, retries):
{{CONTEXT}}

Tasks:
1. Summarize the **EVIDENCE**: totals, failed tests, error messages, timeouts, locator names, URLs.
2. For each failure, give ranked **HYPOTHESES** among: product defect, test defect (locator, timing, data), environment or network issue,
   test data or state problem. Say what evidence supports each and what would disprove it.
3. Suggest the next diagnostic step for each failure (open trace, rerun in headed mode, run single test, compare with manual execution).
4. Identify patterns across failures (same page, same locator, same error).
5. Do **not** classify any failure as a confirmed product defect. A defect is confirmed only after a human reproduces it.

## Guardrails (mandatory)

1. AI output is a **hypothesis**, never a confirmed defect or a confirmed result.
2. Never invent execution results, versions, screenshots, logs or requirements. If information is missing, write `NOT PROVIDED` and ask.
3. Label every statement as **EVIDENCE** (taken from the input) or **HYPOTHESIS** (AI inference).
4. Finish with a "Human review required" section listing what a QA engineer must verify before use.
5. Do not include real credentials, personal data or secrets in the answer.
