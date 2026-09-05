# Task 002 — OshiLive 3.0 YouTube Runtime Integration

Status: READY_FOR_IMPLEMENTATION
Owner: Developer Agent (GitHub Copilot / local agent)
Auditor: ChatGPT
Related issue: #2

## Goal
Connect the actual OshiLive 3.0 runtime to YouTube Data API v3 using the already-configured `YOUTUBE_API_KEY` secret, without exposing the key and without recreating the previous quota-exhaustion pattern.

## Important source-of-truth note
The current live product is the ChatGPT Sites deployment `oshilive-3.fkazukazu63.chatgpt.site`. This repository is a legacy OshiLive codebase and has NOT been proven to be the exact source of that Site. Do not claim deployment success by editing this repository alone. Use this task as the implementation specification and, when working in the actual Sites source, apply the same requirements there.

## Required behavior
1. Keep `YOUTUBE_API_KEY` server-side only. Never expose it in browser code, HTML, API responses, console logs, generated error pages, or committed files.
2. Implement/repair server-side handlers for:
   - live status for configured Nijisanji livers
   - upcoming/next streams
   - resolving a YouTube channel URL/handle to channel metadata for the add-liver flow
3. Keep the product Nijisanji-only.
4. Connect the current UI so the placeholders `Live status is waiting for connection`, `Schedule is waiting for connection`, and `API連携待ち` are replaced by real API-backed states when data is available.
5. Do not render API errors as `OFFLINE`. Use a neutral unavailable/stale state for quota/network/config errors.
6. Preserve favorites, profile/navigation behavior, mobile responsiveness, and current visual structure unless a minimal UI change is required for status/error display.

## Quota design
The old design repeatedly called YouTube `search.list` per liver and exhausted the daily Search Queries quota. Do NOT repeat that architecture.

Implement all of the following:
- server-side caching with a reasonable TTL
- deduplication of simultaneous identical requests
- no one-search-per-liver-per-browser-refresh polling loop
- throttled refresh behavior
- preserve last known safe data when a refresh fails
- prefer lower-cost/batched YouTube API calls where technically possible
- centralize any unavoidable `search.list` usage rather than letting every browser session trigger it

## Error handling
- Missing/invalid secret: return a sanitized configuration error; never echo the key.
- HTTP 403/429 quota errors: return a structured `temporarily_unavailable` / `quota_limited` state.
- Network failures: return stale cached data when available; otherwise a neutral unavailable state.
- Invalid channel URL: reject cleanly without creating a liver entry.
- Non-Nijisanji channel: do not save it as a liver.

## Acceptance checks
- [ ] No API key present in client source, response bodies, logs, or committed files.
- [ ] Live-status response is structured and no longer a placeholder when YouTube is available.
- [ ] Upcoming-stream response is structured or returns a legitimate empty state.
- [ ] At least one known Nijisanji YouTube URL/handle resolves through the add-liver flow.
- [ ] Quota errors are not displayed as `OFFLINE`.
- [ ] Repeated page refreshes do not create one YouTube search request per liver per refresh.
- [ ] Existing navigation/favorites/mobile layout still work.
- [ ] `npm test` passes where this repository's tests apply.
- [ ] No unrelated file changes.
- [ ] Developer handoff marks `readyForAudit: true` only after validation.

## Handoff required from developer
Provide:
- changed files
- implementation summary
- validation commands/results
- evidence that the key is server-only
- evidence of caching/throttling behavior
- known limitations
- `readyForAudit: true/false`

## Auditor rule
The developer must NOT set `safetyStatus` to `safe`. ChatGPT independently decides `safe`, `review`, or `stopped` after reviewing actual deployed-site evidence.
