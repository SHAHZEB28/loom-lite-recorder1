import { useEffect, useRef, useState } from 'react';

const initialStatus = 'idle';
const fallbackMimeType = 'video/webm';

function getSupportedMimeType() {
  if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') {
    return '';
  }

  const preferredTypes = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    fallbackMimeType,
  ];

  return preferredTypes.find((type) => MediaRecorder.isTypeSupported(type)) ?? '';
}

function useScreenRecorder() {
  const [status, setStatus] = useState(initialStatus);
  const [error, setError] = useState('');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [recordingUrl, setRecordingUrl] = useState('');
  const [webcamEnabled, setWebcamEnabled] = useState(false);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const webcamStreamRef = useRef(null);
  const chunksRef = useRef([]);
  const recordingUrlRef = useRef('');
  const statusRef = useRef(initialStatus);

  useEffect(() => {
    recordingUrlRef.current = recordingUrl;
  }, [recordingUrl]);

  useEffect(() => {
    if (status !== 'recording') {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setElapsedSeconds((currentValue) => currentValue + 1);
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [status]);

  useEffect(() => {
    return () => {
      if (recordingUrlRef.current) {
        URL.revokeObjectURL(recordingUrlRef.current);
      }

      mediaRecorderRef.current = null;
      stopTracks();

      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
        webcamStreamRef.current = null;
      }
    };
  }, []);

  const setRecordingAsset = (blob, nextUrl) => {
    if (recordingUrlRef.current) {
      URL.revokeObjectURL(recordingUrlRef.current);
    }

    recordingUrlRef.current = nextUrl;
    setRecordedBlob(blob);
    setRecordingUrl(nextUrl);
  };

  const clearRecordingAsset = () => {
    setRecordedBlob(null);

    if (recordingUrlRef.current) {
      URL.revokeObjectURL(recordingUrlRef.current);
      recordingUrlRef.current = '';
      setRecordingUrl('');
    }
  };

  const resetRecording = () => {
    chunksRef.current = [];
    clearRecordingAsset();
  };

  const setRecorderStatus = (nextStatus) => {
    statusRef.current = nextStatus;
    setStatus(nextStatus);
  };

  const stopTracks = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.onended = null;
        track.stop();
      });
      streamRef.current = null;
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;

    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
    }
  };

  const toggleWebcam = async () => {
    try {
      if (webcamEnabled) {
        if (webcamStreamRef.current) {
          webcamStreamRef.current.getTracks().forEach((track) => {
            track.stop();
          });
          webcamStreamRef.current = null;
        }

        setWebcamEnabled(false);
        return;
      }

      const webcamStream = await navigator.mediaDevices.getUserMedia({ video: true });
      webcamStreamRef.current = webcamStream;
      setWebcamEnabled(true);
    } catch (caughtError) {
      console.error(caughtError);
    }
  };

  const clearRecording = () => {
    const recorder = mediaRecorderRef.current;

    if (recorder && recorder.state !== 'inactive') {
      recorder.ondataavailable = null;
      recorder.onstop = null;
      recorder.onerror = null;
      recorder.stop();
    }

    stopTracks();
    mediaRecorderRef.current = null;
    setError('');
    setElapsedSeconds(0);
    resetRecording();
    setRecorderStatus(initialStatus);
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      setError('Screen recording is not supported in this browser.');
      setRecorderStatus('error');
      return;
    }

    if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') {
      setError('MediaRecorder is not available in this browser.');
      setRecorderStatus('error');
      return;
    }

    if (statusRef.current === 'requesting' || statusRef.current === 'recording') {
      return;
    }

    try {
      setError('');
      setRecorderStatus('requesting');

      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;

      let recorder;

      try {
        const mimeType = getSupportedMimeType();
        recorder = mimeType
          ? new MediaRecorder(stream, { mimeType })
          : new MediaRecorder(stream);

        chunksRef.current = [];
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunksRef.current.push(event.data);
          }
        };

        recorder.onstop = () => {
          const blobType = recorder.mimeType || mimeType || fallbackMimeType;

          mediaRecorderRef.current = null;
          stopTracks();

          if (chunksRef.current.length === 0) {
            setError('No recording data was captured. Please try again.');
            setRecorderStatus('error');
            return;
          }

          const blob = new Blob(chunksRef.current, { type: blobType });
          const url = URL.createObjectURL(blob);

          setRecordingAsset(blob, url);
          setError('');
          setRecorderStatus('stopped');
        };

        recorder.onerror = () => {
          mediaRecorderRef.current = null;
          stopTracks();
          setError('Something went wrong while recording your screen.');
          setRecorderStatus('error');
        };

        stream.getTracks().forEach((track) => {
          track.onended = () => {
            if (recorder.state !== 'inactive') {
              recorder.stop();
            }
          };
        });

        try {
          recorder.start();
        } catch (caughtError) {
          mediaRecorderRef.current = null;
          stopTracks();
          setError(
            caughtError?.message || 'Unable to begin recording after screen access was granted.',
          );
          setRecorderStatus('error');
          return;
        }

        clearRecordingAsset();
        setElapsedSeconds(0);
        setRecorderStatus('recording');
      } catch (caughtError) {
        mediaRecorderRef.current = null;
        stopTracks();
        setError(
          caughtError?.message || 'Unable to prepare the recorder after screen access was granted.',
        );
        setRecorderStatus('error');
        return;
      }
    } catch (caughtError) {
      setError(
        caughtError?.name === 'NotAllowedError'
          ? 'Screen recording permission was denied.'
          : caughtError?.name === 'AbortError'
            ? 'Screen selection was canceled before recording started.'
          : 'Unable to start screen recording.',
      );
      setRecorderStatus(recordedBlob ? 'stopped' : 'error');
      mediaRecorderRef.current = null;
      stopTracks();
    }
  };

  return {
    elapsedSeconds,
    status,
    error,
    recordedBlob,
    recordingUrl,
    webcamEnabled,
    webcamStreamRef,
    startRecording,
    stopRecording,
    clearRecording,
    toggleWebcam,
  };
}

export default useScreenRecorder;
