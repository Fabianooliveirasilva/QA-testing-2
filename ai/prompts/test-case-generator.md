# Prompt: Test Case Generator

**Purpose:** analyze a feature or requirement and generate structured, non-duplicated test cases.
**How to use:** paste into ChatGPT or Claude, replace the `{{...}}` fields, review the output with the checklist in
[../templates/ai-output-review-checklist.md](../templates/ai-output-review-checklist.md).
**Example of a reviewed output:** the "Part 2 — Shopping cart cases" section of [docs/test-cases.md](../../docs/test-cases.md).

---

## Prompt

Act as a Senior QA Engineer.

Analyze the following feature:
{{FEATURE_NAME}}

Context and known behaviour (optional, mark anything uncertain):
{{CONTEXT_OR_REQUIREMENTS}}

Generate test cases covering:
- Positive scenarios
- Negative scenarios
- Boundary conditions
- Edge cases
- Regression scenarios

For each test case provide:
- Test ID
- Title
- Preconditions
- Test steps
- Expected result
- Priority (P1/P2/P3)
- Test type (Positive / Negative / Boundary / Edge / Regression)
- Verification status: `Verified`, `Not yet verified` or `Judgement` (expected result is an assumption)

Avoid duplicate scenarios. Follow professional QA standards. Output a Markdown table.

## Guardrails (mandatory)

1. AI output is a **hypothesis**, never a confirmed defect or a confirmed result.
2. Never invent execution results, versions, screenshots, logs or requirements. If information is missing, write `NOT PROVIDED` and ask.
3. Label every statement as **EVIDENCE** (taken from the input) or **HYPOTHESIS** (AI inference).
4. Finish with a "Human review required" section listing what a QA engineer must verify before use.
5. Do not include real credentials, personal data or secrets in the answer.
