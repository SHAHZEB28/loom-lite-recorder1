import { formatElapsedTime } from '../utils/formatTime';

function RecorderControls({
  elapsedSeconds,
  status,
  error,
  hasRecording,
  webcamEnabled,
  toggleWebcam,
  onStart,
  onStop,
  onClear,
}) {
  const isRecording = status === 'recording';
  const isRequesting = status === 'requesting';
  const canClear = hasRecording || Boolean(error);

  const statusMessage = {
    idle: 'Ready when you are.',
    requesting: 'Choose the screen, window, or tab you want to record.',
    recording: 'Recording is live and saved locally when you stop.',
    stopped: 'Your recording is ready to preview or download.',
    error: 'Something needs attention before the next recording.',
  }[status];

  return (
    <div className="controls-card">
      <div className="controls-header">
        <div className="status-row" aria-live="polite">
          <span className={`status-pill status-${status}`}>
            <span className="status-dot" />
            {status}
          </span>
          {isRecording ? (
            <span className="timer-pill">{formatElapsedTime(elapsedSeconds)}</span>
          ) : null}
        </div>
        <span className="status-text">{statusMessage}</span>
      </div>

      <div className={`state-panel state-panel-${status}`}>
        <div className="state-panel-icon" aria-hidden="true">
          {isRecording ? 'REC' : isRequesting ? '...' : error ? '!' : '○'}
        </div>
        <div className="state-panel-copy">
          <p className="state-panel-title">
            {isRecording
              ? 'Recording in progress'
              : isRequesting
                ? 'Waiting for screen selection'
                : error
                  ? 'Recording needs attention'
                  : hasRecording
                    ? 'Recording ready'
                    : 'Start a new capture'}
          </p>
          <p className="helper-text">
            {isRecording
              ? 'Keep this tab open while capturing. Use stop when you are finished.'
              : isRequesting
                ? 'The browser picker is open. Select the screen, tab, or window to continue.'
                : error
                  ? 'You can clear the current message and try again right away.'
                  : hasRecording
                    ? 'Preview your clip below or download it immediately.'
                    : 'Everything runs locally in the browser with no upload step.'}
          </p>
        </div>
      </div>

      <div className="button-row">
        <button
          className={`primary-button ${isRecording ? 'primary-button-live' : ''}`}
          onClick={onStart}
          disabled={isRecording || isRequesting}
        >
          {isRequesting ? 'Opening Picker...' : 'Start Recording'}
        </button>
        <button className="secondary-button" onClick={onStop} disabled={!isRecording}>
          Stop Recording
        </button>
        <button
          className={`secondary-button ${webcamEnabled ? 'webcam-active' : ''}`}
          onClick={toggleWebcam}
          type="button"
        >
          {webcamEnabled ? 'Webcam On' : 'Webcam Off'}
        </button>
        <button className="ghost-button" onClick={onClear} disabled={!canClear}>
          Clear
        </button>
      </div>

      <p className="helper-text">
        Browser support is best in Chromium-based browsers. Audio availability depends on
        what the browser allows for the selected screen or tab.
      </p>

      {error ? (
        <div className="error-banner" role="alert">
          <p className="error-title">Recording issue</p>
          <p className="error-text">{error}</p>
        </div>
      ) : null}
    </div>
  );
}

export default RecorderControls;
