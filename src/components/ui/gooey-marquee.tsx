"use client"

interface GooeyMarqueeProps {
  text: string
  className?: string
  speed?: number
}

export function GooeyMarquee({ text, className = "", speed = 50 }: GooeyMarqueeProps) {
  // Repetindo o texto para garantir que ele preencha a largura total em telas largas
  const repeatedText = `${text} ${text} ${text} `;

  return (
    <div className={`relative w-full h-32 flex items-center overflow-hidden bg-black border-t border-b border-white/5 ${className}`}>
      <style>{`
        .clean-marquee-track {
          display: flex;
          width: max-content;
          animation: clean-marquee-scroll-react ${speed}s linear infinite;
        }
        .clean-marquee-group {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          white-space: nowrap;
          font-family: monospace;
          font-weight: bold;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-size: 3.5rem;
          color: #39FF14;
          text-shadow: 0 0 10px rgba(57, 255, 20, 0.3);
        }
        @keyframes clean-marquee-scroll-react {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <div className="clean-marquee-track">
        <div className="clean-marquee-group">
          <span>{repeatedText}</span>
        </div>
        <div className="clean-marquee-group">
          <span>{repeatedText}</span>
        </div>
      </div>
    </div>
  )
}
