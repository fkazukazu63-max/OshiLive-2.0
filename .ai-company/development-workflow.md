# OshiLive Development Workflow

## Goal
Keep development efficient, low-friction, and low-token while preserving safety and auditability.

## Default operating mode
- Use PC as the primary development surface.
- Remote/mobile access is optional and should be used only when it materially helps (for example, when away from the PC or when a remote approval/check is needed).
- Do not duplicate the same checks across PC and mobile unless needed.

## Token-efficient collaboration rules
- Prefer one consolidated task brief with clear acceptance criteria over many small back-and-forth instructions.
- Batch safe investigation, edits, tests, GitHub updates, and validation into one pass when possible.
- Ask the user only when a decision, credential, approval, payment, account change, or other non-delegable action is genuinely required.
- Avoid requesting screenshots for steps that can be verified through connected tools or repository evidence.
- Do not repeatedly restate unchanged specifications, logs, or status.
- Reuse existing task files, issues, and prior validated evidence instead of re-reading or re-writing the same context unnecessarily.
- Report only major checkpoints by default: implementation complete, blocked/user action needed, test/build result, deployment result, audit result.
- Final status reports should be concise: Done / Remaining / Next.

## Notification / interruption policy
- Development work may notify or interrupt the user only for meaningful checkpoints, blockers, required user actions, deployment/audit completion, or important security/production issues.
- Do not notify for routine file edits, minor refactors, individual test passes, or small intermediate steps.

## Safety and quality remain mandatory
Token reduction must never bypass:
- secret/API-key protection
- required tests/build checks
- quota protections
- production safety checks
- independent audit where required

When efficiency and safety conflict, safety wins.
