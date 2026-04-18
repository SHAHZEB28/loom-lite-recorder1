import { useState } from 'react';
import { formatElapsedTime } from '../utils/formatTime';

function VideoPreview({ error, elapsedSeconds, recordingUrl, hasRecording, recordedBlob, status }) {
  const [filename, setFilename] = useState('screen-recording');

  if (!hasRecording || !recordingUrl) {
    const emptyState = {
      idle: {
        title: 'Your recording will appear here.',
        text: 'Start and stop a screen capture to generate a clean preview and a downloadable video file.',
      },
      requesting: {
        title: 'Waiting for your screen selection.',
        text: 'Choose the screen, window, or browser tab in the system picker to begin recording.',
      },
      recording: {
        title: 'Recording is live.',
        text: 'The video preview will appear here as soon as recording stops.',
      },
      stopped: {
        title: 'No recording available yet.',
        text: 'Try another capture if the browser ended the session before any video data was saved.',
      },
      error: {
        title: 'Recording did not start cleanly.',
        text: error || 'Try starting the screen share again and confirm the browser permissions prompt.',
      },
    }[status];

    return (
      <section className="preview-card preview-empty">
        <div className={`empty-state empty-state-${status}`}>
          <div className="empty-state-icon" aria-hidden="true">
            {status === 'error' ? '!' : status === 'recording' ? 'REC' : '•'}
          </div>
          <p className="preview-label">Preview</p>
          <h2>{emptyState.title}</h2>
          <p className="preview-text">{emptyState.text}</p>
          {status === 'recording' ? (
            <div className="preview-inline-status">
              <span className="recording-pulse" />
              Recording {formatElapsedTime(elapsedSeconds)}
            </div>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section className="preview-card">
      <div className="preview-header">
        <div>
          <p className="preview-label">Preview</p>
          <h2>Recorded video</h2>
          <p className="preview-subtext">
            Local recording complete{elapsedSeconds ? ` • ${formatElapsedTime(elapsedSeconds)}` : ''}.
          </p>
          {recordedBlob && (
            <p className="preview-subtext">
              File size: {(recordedBlob.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          )}
        </div>
        <div className="download-row">
          <input
            className="filename-input"
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value || 'screen-recording')}
            placeholder="screen-recording"
            aria-label="File name"
          />
          <span className="filename-ext">.webm</span>
          <a className="download-link" href={recordingUrl} download={`${filename}.webm`}>
            Download
          </a>
        </div>
      </div>

      <div className="video-frame">
        <video className="video-player" src={recordingUrl} controls playsInline />
      </div>
    </section>
  );
}

export default VideoPreview;
