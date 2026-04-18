import { useEffect, useState } from 'react';
import RecorderControls from './components/RecorderControls';
import VideoPreview from './components/VideoPreview';
import WebcamBubble from './components/WebcamBubble';
import useScreenRecorder from './hooks/useScreenRecorder';

const themeStorageKey = 'loom-lite-theme';

function getInitialTheme() {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const savedTheme = window.localStorage.getItem(themeStorageKey);

  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function App() {
  const {
    status,
    error,
    elapsedSeconds,
    recordingUrl,
    recordedBlob,
    webcamEnabled,
    toggleWebcam,
    webcamStreamRef,
    startRecording,
    stopRecording,
    clearRecording,
  } = useScreenRecorder();
  const [theme, setTheme] = useState(getInitialTheme);
  const hasRecording = Boolean(recordedBlob && recordingUrl);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(themeStorageKey, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <main className="app-page">
      <div className="app-shell">
        <header className="topbar">
          <div className="brand-lockup">
            <p className="eyebrow">Loom Lite Recorder</p>
            <h1>Record your screen with a clean, focused workflow.</h1>
            <p className="hero-text">
              Capture, preview, and download in one lightweight browser experience.
            </p>
          </div>

          <button className="theme-toggle" onClick={toggleTheme} type="button">
            <span className="theme-toggle-icon" aria-hidden="true">
              {theme === 'light' ? '◐' : '◑'}
            </span>
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </header>

        <section className="hero-card">
          <div className="hero-copy">
            <div className="hero-copy-inner">
              <p className="eyebrow">Minimal Screen Recorder</p>
              <h2 className="hero-title">Record your screen, preview it, and download it instantly.</h2>
              <p className="hero-text">
                A polished React + Vite screen recorder powered by the browser&apos;s
                MediaRecorder API.
              </p>
            </div>

            <div className="hero-meta">
              <span className="meta-pill">Browser-only</span>
              <span className="meta-pill">No upload step</span>
              <span className="meta-pill">Downloadable WebM</span>
            </div>
          </div>

          <RecorderControls
            elapsedSeconds={elapsedSeconds}
            error={error}
            hasRecording={hasRecording}
            onClear={clearRecording}
            onStart={startRecording}
            onStop={stopRecording}
            status={status}
            toggleWebcam={toggleWebcam}
            webcamEnabled={webcamEnabled}
          />
        </section>

        <VideoPreview
          error={error}
          elapsedSeconds={elapsedSeconds}
          hasRecording={hasRecording}
          recordedBlob={recordedBlob}
          recordingUrl={recordingUrl}
          status={status}
        />
      </div>
      <WebcamBubble webcamStreamRef={webcamStreamRef} webcamEnabled={webcamEnabled} />
    </main>
  );
}

export default App;
