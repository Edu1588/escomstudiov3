import { useEffect, useRef, useState } from "react";

const INTRO_VIDEO_URL =
  "https://res.cloudinary.com/djw0tqmiw/video/upload/v1781727174/kaued2arj9spvxx0h7yi.mp4";

export default function LoadingScreen({
  audioRef,
  onComplete,
}: {
  audioRef: React.RefObject<HTMLVideoElement | null>;
  onComplete: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (video) {
      video.play().catch(() => {
        onComplete();
      });
    }
    if (audio) {
      audio.muted = false;
      audio.volume = 0;
    }
  }, [onComplete, audioRef]);

  const handleVideoEnd = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.65;
    }
    setExiting(true);
    setTimeout(onComplete, 1000);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "#000",
        overflow: "hidden",
        transition: exiting
          ? "filter 1s ease, opacity 1s ease"
          : "none",
        filter: exiting ? "blur(20px)" : "blur(0px)",
        opacity: exiting ? 0 : 1,
      }}
    >
      <video
        ref={videoRef}
        src={INTRO_VIDEO_URL}
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        style={{
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  );
}
