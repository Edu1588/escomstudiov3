/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { logPageView } from "./lib/analytics";

// Components
import LoadingScreen from "./components/LoadingScreen";
import BrillianceHome from "./components/ui/brilliance-home";
import LanguageSwitcher from "./components/LanguageSwitcher";

const WELCOME_AUDIO_URL =
  "https://res.cloudinary.com/djw0tqmiw/video/upload/v1780445623/sxzx7zsuj1tgmtwbfovu.mp3";

export default function App() {
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    if (loading) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [loading]);

  useEffect(() => {
    logPageView("HOME");
  }, []);

  return (
    <main className="relative">
      <LanguageSwitcher />

      {/* video em vez de audio — muted autoplay é SEMPRE permitido pelo browser */}
      {/* video em vez de audio — muted autoplay é SEMPRE permitido pelo browser */}
      <video
        ref={audioRef}
        src={WELCOME_AUDIO_URL}
        autoPlay
        muted
        preload="auto"
        playsInline
        style={{ display: "none" }}
      />

      <div className="flex flex-col">
        <BrillianceHome />
      </div>

      {loading && (
        <LoadingScreen audioRef={audioRef} onComplete={() => setLoading(false)} />
      )}
    </main>
  );
}
