import { useEffect, useRef } from 'react';

function WebcamBubble({ webcamStreamRef, webcamEnabled }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && webcamStreamRef.current) {
      videoRef.current.srcObject = webcamStreamRef.current;
    }
  }, [webcamEnabled, webcamStreamRef]);

  if (!webcamEnabled) return null;

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '3px solid var(--accent)',
        boxShadow: 'var(--shadow-md)',
        zIndex: 999,
      }}
    />
  );
}

export default WebcamBubble;
