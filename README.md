# Loom Lite Recorder

A small Loom-like screen recorder built with React and Vite. It records the screen in the browser, shows an instant preview, and lets the user download the result locally.

## What It Does

- Starts screen recording with browser APIs
- Stops recording cleanly
- Previews the captured video
- Downloads the recording as a `.webm` file
- Handles empty, loading, and error states with simple UI feedback

## Tech

- React
- Vite
- `navigator.mediaDevices.getDisplayMedia`
- `MediaRecorder`

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Notes

- Best experience is in Chromium-based browsers.
- Audio capture support depends on what the browser allows for the chosen tab, window, or screen.
- Output is kept as `webm` to stay simple and fully frontend-only.
