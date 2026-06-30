"use client";

import * as React from "react";
import { Player } from "@remotion/player";
import { PerspectiveMarquee } from "./remocn-perspective-marquee";

function usePrefersDark() {
  const [isDark, setIsDark] = React.useState(true); // Default para dark já que o Studio é Dark

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setIsDark(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return isDark;
}

function PerspectiveMarqueeScene({ isDark }: { isDark: boolean }) {
  return (
    <PerspectiveMarquee
      items={[
        "Sites",
        "Landing Pages",
        "ecommerce",
        "mobile First",
        "Hospedagem",
        "Manutenção",
        "Emails personalizados",
        "Google Ads",
        "SItes órgãos Públicos",
        "ecommerce",
      ]}
      rotateY={-28}
      rotateX={8}
      perspective={1200}
      pixelsPerFrame={2}
      background={isDark ? "#000000" : "#fafafa"}
      fadeColor={isDark ? "#000000" : "#fafafa"}
      color={isDark ? "#fafafa" : "#171717"}
    />
  );
}

export default function PerspectiveMarqueeDemo() {
  const isDark = usePrefersDark();

  return (
    <div
      className="w-full overflow-hidden"
      style={{ backgroundColor: isDark ? "#000000" : "#fafafa", height: "350px", position: "relative" }}
    >
      <Player
        component={PerspectiveMarqueeScene}
        inputProps={{ isDark }}
        durationInFrames={240}
        fps={30}
        compositionWidth={1280}
        compositionHeight={350}
        style={{ width: "100%", height: "100%" }}
        controls={false}
        autoPlay
        loop
        clickToPlay={false}
      />
    </div>
  );
}
