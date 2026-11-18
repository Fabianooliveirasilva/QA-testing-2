# AI-Assisted QA — Worked Examples

Each example runs one prompt from [../prompts/](../prompts/README.md) on **real project data** and shows the answer, followed by
what a human reviewer must check. They demonstrate the workflow; they are not confirmed results.

| Example | Prompt | Input source |
|---------|--------|--------------|
| [bug-report-assistant-example.md](bug-report-assistant-example.md) | Bug Report Assistant | Raw notes from the exploratory session behind BUG-001 |
| [coverage-analyzer-example.md](coverage-analyzer-example.md) | Test Coverage Analyzer | The real cart test-case list in `docs/test-cases.md` |
| [regression-advisor-example.md](regression-advisor-example.md) | Regression Test Advisor | A **hypothetical** change (labelled as such) and the real suite |
| [test-result-analyzer-example.md](test-result-analyzer-example.md) | Test Result Analyzer | A real failed Playwright run from this project's history |

Conventions used in every example:

- **EVIDENCE** = taken from the input. **HYPOTHESIS** = AI inference, unconfirmed.
- No result, version or log is invented. Where input was missing, the answer says `NOT PROVIDED`.
- The last section, **Human review**, records what was checked and what is still pending. A statement that something was
  "approved" appears only where a human actually approved it; otherwise the status is `Pending`.
