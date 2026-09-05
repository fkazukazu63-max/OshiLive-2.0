# OshiLive Copilot Development Rules

You are the implementation agent for OshiLive. Follow these rules strictly.

## Scope
- Work only inside this repository unless an explicit approved task says otherwise.
- Never access or modify paths outside entries allowed by `.ai-company/approved-projects.json`.
- Do not publish, deploy, purchase, contact third parties, change billing, or rotate credentials.

## Security
- Never hard-code API keys, tokens, passwords, personal data, or location data.
- Read secrets only from environment variables or repository secret mechanisms.
- Never print secret values to logs.
- If a secret appears in source, stop implementation and mark the task blocked for security review.

## Change discipline
- Make the smallest change needed for the requested task.
- Do not delete large groups of files, rewrite unrelated files, or perform destructive migrations.
- Preserve existing behavior unless the task explicitly changes it.
- Use a branch and PR for meaningful changes. Do not push directly to `main` for feature work.

## Validation
Before marking implementation complete:
1. Run `npm test`.
2. Confirm changed JavaScript files parse successfully.
3. Review the diff for unrelated changes.
4. Confirm no secrets were introduced.
5. Update `.ai-company/status.json` implementation fields only. Do not set `safetyStatus` to `safe`; the independent ChatGPT auditor owns safety approval.

## Handoff
When finished, leave a concise handoff containing:
- task summary
- changed files
- validation commands and results
- known risks or TODOs
- readyForAudit: true/false

The independent auditor may return `safe`, `review`, or `stopped`. If `review` or `stopped`, do not continue deployment until the reported issue is resolved.
