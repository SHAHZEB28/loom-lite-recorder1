# Submission Reasoning

## 2-Day Scope

For a two-day assignment, the right target is a dependable browser-only recorder with a small code surface:

- Start and stop screen capture using `getDisplayMedia` and `MediaRecorder`
- Preview the resulting video immediately
- Download the file locally without any backend
- Keep the code modular enough to explain in a walkthrough
- Polish only the states users hit most often: idle, requesting permission, recording, success, and error

## 2-Week Roadmap

With two weeks, I would extend this into a more realistic product direction:

- Add microphone selection and optional camera overlay
- Support recording timers, elapsed duration, and restart flows
- Improve browser compatibility handling and format fallback behavior
- Add lightweight tests around the recorder state machine and UI states
- Persist recent recordings locally for session recovery
- Introduce upload/sharing flows, thumbnails, and metadata once backend scope is allowed

## Trade-Offs

- `webm` was kept as the primary output because it is the most straightforward format for `MediaRecorder`; wider export compatibility would need transcoding or backend help
- The app stays browser-only, which keeps the architecture simple but limits persistence and sharing
- Styling is intentionally polished but restrained so time goes into reliability first
- Full automated testing was not added in this pass to keep the solution aligned with the short assignment scope
