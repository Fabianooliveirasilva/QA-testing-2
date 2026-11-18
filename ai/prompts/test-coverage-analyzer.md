# Prompt: Test Coverage Analyzer

**Purpose:** identify missing scenarios and coverage gaps in an existing set of test cases.

---

## Prompt

Act as a Senior QA Engineer reviewing test coverage.

Feature or area under test:
{{FEATURE}}

Existing test cases (IDs and titles are enough):
{{EXISTING_TEST_CASES}}

Known requirements or observed behaviour:
{{REQUIREMENTS}}

Tasks:
1. Map the existing cases to functional areas, user roles and data conditions; show a coverage table.
2. List gaps: missing positive, negative, boundary, edge and regression scenarios, and untested states or data.
3. Flag duplicated or overlapping cases that could be merged.
4. Suggest up to 10 new cases, ordered by risk, each with a one-line rationale. Do not write full steps unless asked.
5. State which areas you could not assess because information was missing.

## Guardrails (mandatory)

1. AI output is a **hypothesis**, never a confirmed defect or a confirmed result.
2. Never invent execution results, versions, screenshots, logs or requirements. If information is missing, write `NOT PROVIDED` and ask.
3. Label every statement as **EVIDENCE** (taken from the input) or **HYPOTHESIS** (AI inference).
4. Finish with a "Human review required" section listing what a QA engineer must verify before use.
5. Do not include real credentials, personal data or secrets in the answer.
