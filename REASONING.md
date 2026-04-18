# Product & Engineering Reasoning

This project was scoped as a 2-day MVP. The goal was not to imitate all of Loom, but to ship a stable end-to-end recording flow that feels usable and intentional.

## 0. Why Free? The "SaaS is Dead" Angle

Mythical Enterprises is betting that removing the paywall is itself the product strategy. The "SaaS is dead" thesis means frictionless access is the moat, not feature gating. The sustainable model for this is open-core: the recorder stays free and browser-based forever, while a future paid tier unlocks cloud storage, team workspaces, and viewer analytics. This keeps acquisition cost near zero while creating a natural upgrade path for teams who outgrow local-only recording.

## 1. What I Built in 2 Days

- A browser-based screen recorder using `getDisplayMedia` and `MediaRecorder`
- A complete user flow: start recording, select a screen/tab/window, stop, preview, and download
- Clear UI states for idle, requesting access, recording, stopped, and error
- Light/dark mode with persistence for a more polished experience
- Basic guardrails and cleanup so the app behaves predictably under common failure cases

The main goal was to deliver a working product loop, not just isolated features. In a short assignment window, stability and usability matter more than breadth.

## 2. What I Intentionally Skipped

- No backend
- No authentication
- No persistence across sessions
- No sharing links

These were deliberate omissions, not oversights. In a 2-day MVP, those features would add infrastructure, data modeling, and product surface area before the core recording experience was proven.

## 3. Product Thinking / Prioritization

- The recording flow was the highest-priority problem to solve because it is the product's core value
- UI clarity mattered because screen capture depends on browser prompts, permissions, and system pickers that can easily confuse users
- I prioritized fewer features with better reliability over a broader but fragile demo

For this kind of product, a narrow flow that works consistently is more valuable than a larger feature list with weak execution.

## 4. Engineering Trade-offs

- Frontend-only architecture kept the project fast to ship, but it means no persistence, uploads, or share links
- `.webm` was the right output format for the MVP because it is the most natural fit for `MediaRecorder` in the browser
- The app supports one recording at a time to keep state management simple and avoid recorder conflicts
- Browser APIs impose real limitations, especially around format support, audio behavior, and cross-browser consistency

These trade-offs favored shipping a dependable MVP over solving long-term platform concerns too early.

## 5. Edge Case Handling

- Cancel picker: handled so the app exits cleanly instead of getting stuck
- Deny permission: surfaced as a clear error state
- Double start: blocked while the app is already requesting or recording
- Cleanup: media tracks are stopped and object URLs are revoked to avoid leaks
- Empty or interrupted recording: handled so the user gets feedback instead of a broken result

This was important because screen recording products fail at the edges, not just in the happy path.

## 6. What I Would Build in the Next 2 Weeks

1. Cloud storage and share links so recordings become useful beyond a single local session
2. Authentication so recordings can belong to users and support a real product workflow
3. Recording history so users can revisit previous captures
4. Basic editing features such as trimming and title management
5. Transcription to improve searchability and usability
6. Performance and reliability improvements, including better testing and browser compatibility work

This sequence reflects product value first: make recordings shareable, then make them persistent, then make them easier to manage and refine.

## 7. Final Thought

- I focused on quality over quantity
- The result is a stable, usable MVP with a clear upgrade path
- For a short take-home assignment, I believe strong prioritization is more important than feature volume
