# Task 003 — Fix Add Channel NIJISANJI verification

Status: READY_FOR_IMPLEMENTATION
Owner: Developer Agent (local Copilot / coding agent)
Auditor: ChatGPT
Related issue: #3

## Goal
Fix the deployed OshiLive 3.0 Add Channel flow so valid official NIJISANJI creators outside the initial configured three can be added safely, while preserving the current server-only API-key handling and quota-conscious YouTube runtime design.

## Reproduction
The current deployed Site rejects Ibrahim with:

`Only verified NIJISANJI channels can be added.`

This reproduces with both:
- `https://www.youtube.com/@Ibrahim`
- `https://www.youtube.com/channel/UCmZ1Rbthn-6Jm_qOGjYsh5A`

Favorites work and the three initial creators render normally, so the defect appears isolated to channel resolution / NIJISANJI verification for creators outside the initial configured set.

## Required behavior
1. Accept both YouTube `@handle` URLs and `/channel/<id>` URLs.
2. Resolve Ibrahim correctly as a valid NIJISANJI creator.
3. Resolve at least one additional NIJISANJI creator outside the original three.
4. Continue rejecting non-NIJISANJI creators.
5. Reject malformed URLs cleanly.
6. Do not weaken verification into a generic YouTube-channel acceptance check.
7. Avoid a hard-coded allowlist limited to the initial three creators. Use a maintainable verification source/mechanism for the supported NIJISANJI roster.
8. Preserve existing favorites, navigation, profile, theme/language controls, schedule/live UI, and mobile responsiveness.

## Security / quota constraints
Do not regress any of the protections approved in Task 002:
- `YOUTUBE_API_KEY` stays server-side only.
- No secret values in client bundles, responses, logs, or committed files.
- Do not reintroduce YouTube `search.list`.
- Preserve server caching, throttling, stale fallback, and in-flight request deduplication.
- Keep channel/video API usage batched where possible.

## Tests required
Add or update tests to cover:
- Ibrahim handle URL => valid
- Ibrahim channel-ID URL => valid
- another NIJISANJI creator outside the original three => valid
- known non-NIJISANJI channel => rejected
- malformed URL => rejected cleanly
- secret non-disclosure still passes
- existing cache/deduplication behavior still passes

## Validation
Before deployment:
- `npm test` passes
- `npm run build` passes
- `git diff --check` passes
- no `search.list` appears in source/generated runtime
- no API key value appears in source/generated assets

## Production acceptance checks
After deploying the actual ChatGPT Sites source:
- Ibrahim can be added from both URL forms.
- Another NIJISANJI creator outside the initial three can be added.
- Non-NIJISANJI creator remains blocked.
- Favorites still work.
- Existing live/upcoming behavior is unchanged.
- No API-key leakage.
- No quota-regression behavior.

## Handoff required
Provide:
- root cause
- changed files
- implementation summary
- validation commands/results
- verification approach used for NIJISANJI membership
- evidence that security/quota behavior is unchanged
- known limitations
- `readyForAudit: true/false`

Do not self-approve safety. ChatGPT performs the independent production audit.