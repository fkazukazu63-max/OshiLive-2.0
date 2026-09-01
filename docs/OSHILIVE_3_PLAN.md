# OshiLive 3.0 Rebuild Plan

## Product goal
OshiLive should answer three questions immediately:
1. Who is live right now?
2. Who is streaming next?
3. What should I watch today?

## Core experience
- Mobile-first dashboard
- Favorite VTubers as the default focus
- LIVE NOW area at the top
- Upcoming streams sorted by time
- Quick search and add-by-YouTube URL
- Personal recommendation based on mood / content preference
- Japanese / English UI
- Dark mode

## Visual direction
- Clean modern entertainment dashboard
- Strong hierarchy, large thumbnails, clear live badges
- Less text, fewer boxes, more visual scanning
- Responsive for iPhone, iPad, and desktop
- Polished enough to feel like a real consumer product rather than a demo

## Phase 1 — Site prototype
Build the complete UX and visual system in ChatGPT Sites using realistic mock data.

Screens:
- Home / Dashboard
- Discover
- Favorites
- Creator detail
- Settings

Home sections:
- Header + profile/favorites summary
- LIVE NOW carousel/grid
- Up Next timeline
- For You recommendation
- Favorites status

## Phase 2 — Real data
Connect YouTube Data API through a secure server-side layer.
- Never expose API keys in frontend code or repository files
- Live status
- Upcoming streams
- Channel lookup by URL/handle

## Phase 3 — Personalization
- Accounts
- Cross-device favorites
- Notification preferences
- Watch history / recommendation signals

## Phase 4 — Quality
- Tests
- Loading / error / empty states
- Accessibility
- Performance
- PWA / installability

## Migration rule
Keep OshiLive 2.0 intact. Build 3.0 separately, reuse only the useful product ideas, and do not carry over insecure or brittle implementation patterns.
