# OshiLive 3.0 — Codex Remote Workflow

## Purpose
Make OshiLive development controllable from ChatGPT/Codex Remote on iPhone/iPad with short, goal-level instructions instead of repeated setup commands.

## Project
- Repository: `fkazukazu63-max/OshiLive-2.0`
- Product: existing OshiLive 3.0; do not create a replacement product/site unless explicitly requested.
- Product manager / independent auditor: ChatGPT
- Developer agent: Codex or other local coding agent

## Default operating mode
When a Remote session is attached to this repository:
1. Read `AGENTS.md`.
2. Read the relevant file under `.ai-company/tasks/` and its related GitHub issue before editing.
3. Inspect the current repository state and existing implementation before making changes.
4. Work autonomously on safe, reversible repository changes.
5. Keep changes tightly scoped to the active task.
6. Add/update focused tests when behavior changes.
7. Run the validation gate below before declaring implementation complete.
8. Leave a concise handoff for ChatGPT audit.

Do not repeatedly ask the user to approve ordinary source edits, tests, formatting, documentation, or other reversible repository-local work.

## Always stop for the user
Ask before any consequential action involving:
- publishing/deployment or production changes
- credentials, secrets, tokens, or account/security settings
- payment/billing
- destructive or difficult-to-reverse operations
- external communication
- a genuinely ambiguous product decision with meaningful tradeoffs

Never expose, print, commit, or move secret values.

## OshiLive invariants
Preserve unless an active task explicitly changes them:
- `YOUTUBE_API_KEY` remains server-side only.
- Never put secret values in client bundles, responses, logs, tests, fixtures, or committed files.
- Do not use YouTube `search.list`.
- Preserve quota-conscious batching, caching, throttling, stale fallback, and in-flight request deduplication.
- Preserve existing favorites, navigation, profile, theme/language controls, live/upcoming UI, and mobile responsiveness unless the task explicitly targets them.
- Do not weaken NIJISANJI verification into generic YouTube-channel acceptance.

## Validation gate
For implementation tasks, run as applicable:

```bash
npm test
npm run build
git diff --check
```

Also check that:
- `search.list` has not been introduced.
- no API key or other secret appears in source or generated assets.
- behavior changed by the task has focused test coverage.

If a validation step cannot run, report exactly why instead of treating it as passed.

## Completion / handoff format
At the end of a Remote implementation session, report:

- Task / issue
- Root cause (for bug fixes)
- Files changed
- What changed
- Tests and validation results
- Security/quota impact
- Known limitations
- `readyForAudit: true` or `false`
- Next recommended action (one item)

The developer must not mark its own work `safe`; ChatGPT performs the independent audit under `AGENTS.md`.

## Short commands intended for mobile
Once Remote is connected, the user should be able to use commands such as:

- `OshiLiveの最新タスクを確認して、実装とテストまで進めて。公開はしないで。`
- `Issue #3の続き。残っている問題を直してvalidation gateまで。`
- `今の変更をテストして、失敗したら原因を直して。最後に監査用handoffを出して。`
- `このエラーを調べて、安全な修正ならそのまま実装してテストして。`

These commands do not override `AGENTS.md`, active task requirements, or the stop conditions above.
