import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState("INITIALIZING_CORE");

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 1000);
          return 100;
        }
        return prev + Math.floor(Math.random() * 10) + 2;
      });
    }, 100);

    const texts = [
      "INITIALIZING_CORE",
      "LOADING_SYSTEM_RESOURCES",
      "SYNCING_DATABASE",
      "BOOTING_UI_ENGINE",
      "CONNECTION_ESTABLISHED",
    ];
    
    let textIdx = 0;
    const textInterval = setInterval(() => {
      setText(texts[textIdx % texts.length]);
      textIdx++;
    }, 800);

    return () => {
      clearInterval(interval);
      clearInterval(textInterval);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
    >
      <div className="w-full max-w-sm px-6">
        <div className="flex flex-col items-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold tracking-[0.3em] font-display text-white mb-2"
          >
            ESCOM
          </motion.h1>
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            className="text-2xl font-bold tracking-[0.2em] font-display text-white/50"
          >
            STUDIO
          </motion.h2>
        </div>

        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-primary glow-green"
          />
        </div>

        <div className="flex justify-between items-center font-mono text-[10px] tracking-widest uppercase">
          <span className="text-primary">{text}</span>
          <span className="text-white/40">{Math.min(progress, 100)}%</span>
        </div>
      </div>
    </motion.div>
  );
}
