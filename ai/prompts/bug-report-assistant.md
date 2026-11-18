# Prompt: Bug Report Assistant

**Purpose:** turn raw observations into a professional bug report draft.

---

## Prompt

Act as a Senior QA Engineer. Convert the raw notes below into a bug report using the template in
[../templates/bug-report-template.md](../templates/bug-report-template.md).

Raw observations (copy exactly what was seen):
{{RAW_NOTES}}

Environment (browser, OS, URL, user, date):
{{ENVIRONMENT}}

Evidence available (screenshots, traces, logs — list file names only):
{{EVIDENCE}}

Rules:
- Write a short, specific title (what fails, where).
- Steps must be numbered and reproducible; do not add steps that were not in the notes.
- Separate **Expected** from **Actual**. If the expected result is not documented, say so and mark it as a judgement.
- Propose **Severity** and **Priority** separately, with one sentence of reasoning each, as a *suggestion*.
- List open questions needed to reproduce or confirm the issue.
- Put any suspected root cause under "Hypotheses (unconfirmed)".

## Guardrails (mandatory)

1. AI output is a **hypothesis**, never a confirmed defect or a confirmed result.
2. Never invent execution results, versions, screenshots, logs or requirements. If information is missing, write `NOT PROVIDED` and ask.
3. Label every statement as **EVIDENCE** (taken from the input) or **HYPOTHESIS** (AI inference).
4. Finish with a "Human review required" section listing what a QA engineer must verify before use.
5. Do not include real credentials, personal data or secrets in the answer.
