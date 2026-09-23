import React from "react";

interface InteractiveBlurTitleProps {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "span" | "p" | "div";
}

export function InteractiveBlurTitle({
  children,
  className = "",
  as: Component = "h2",
}: InteractiveBlurTitleProps) {
  if (typeof children !== "string") {
    return <Component className={className}>{children}</Component>;
  }

  const words = children.split(" ");

  const handleMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    const el = e.currentTarget;
    el.classList.remove("is-blurred");
    // Força reflow para reiniciar caso o mouse passe novamente
    void el.offsetWidth;
    el.classList.add("is-blurred");
  };

  const handleAnimationEnd = (e: React.AnimationEvent<HTMLSpanElement>) => {
    e.currentTarget.classList.remove("is-blurred");
  };

  return (
    <Component
      className={`select-none cursor-default ${className}`}
      aria-label={children}
    >
      {words.map((word, wordIdx) => (
        <span
          key={wordIdx}
          className="inline-block whitespace-nowrap"
          aria-hidden="true"
        >
          {Array.from(word).map((char, charIdx) => (
            <span
              key={charIdx}
              className="interactive-blur-char inline-block"
              onMouseEnter={handleMouseEnter}
              onAnimationEnd={handleAnimationEnd}
            >
              {char}
            </span>
          ))}
          {wordIdx < words.length - 1 && (
            <span className="inline-block">&nbsp;</span>
          )}
        </span>
      ))}
    </Component>
  );
}
