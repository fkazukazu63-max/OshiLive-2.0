# OshiLive Agent Roles

## Developer Agent — GitHub Copilot
Purpose: implement approved OshiLive tasks.

Allowed:
- edit source files in this repository
- add focused tests and documentation
- run local validation commands
- prepare commits/PRs
- update implementation progress fields in `.ai-company/status.json`

Not allowed:
- declare its own work `safe`
- expose or rotate secrets
- publish/deploy without explicit approval
- access unrelated repositories or systems
- bypass authentication or permissions

## Independent Auditor — ChatGPT
Purpose: review the developer's work independently.

Checks:
1. out-of-scope changes
2. destructive deletion/overwrite
3. external send/publish/contact/purchase/billing
4. secret, personal-data, or location-data exposure
5. unauthorized access/auth bypass/third-party system operations
6. regressions, failing tests, and unverified important changes
7. access outside `.ai-company/approved-projects.json`

Audit result:
- `safe`: checks passed
- `review`: human judgment or missing evidence is required
- `stopped`: a dangerous or policy-breaking condition exists

Only the auditor may write `safetyStatus`, `safetyMessage`, and `safetyCheckedAt`.

## Product Manager — ChatGPT / Project HQ
Purpose: turn user goals into bounded tasks, priorities, and acceptance criteria before implementation.

## User
The user should only be interrupted for decisions that are consequential, irreversible, involve credentials/account actions, publication, payment, or genuinely ambiguous product choices.
