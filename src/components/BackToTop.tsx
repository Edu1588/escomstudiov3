import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after 400px
      setIsVisible(window.scrollY > 400);

      // Calculate scroll progress
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.scrollY / totalHeight) * 100;
      setProgress(currentProgress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-10 right-10 z-[100]"
        >
          <button
            onClick={scrollToTop}
            className="group relative w-14 h-14 bg-black border border-white/10 rounded-full flex items-center justify-center overflow-hidden hover:border-primary/50 transition-colors"
          >
            {/* Progress Circle SVG */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="26"
                fill="none"
                stroke="rgba(0, 255, 0, 0.1)"
                strokeWidth="1"
                className="translate-x-[0px] translate-y-[0px]"
              />
              <motion.circle
                cx="28"
                cy="28"
                r="26"
                fill="none"
                stroke="#00FF00"
                strokeWidth="1"
                strokeDasharray="163.36"
                animate={{ strokeDashoffset: 163.36 - (163.36 * progress) / 100 }}
                className="translate-x-[0px] translate-y-[0px]"
                transition={{ type: "spring", stiffness: 50, damping: 20 }}
              />
            </svg>

            <motion.div
              whileHover={{ y: -4 }}
              className="relative z-10"
            >
              <ArrowUp size={20} className="text-primary" strokeWidth={3} />
            </motion.div>

            {/* Subtle Label on Hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-10 transition-opacity">
               <span className="font-tech text-primary text-[8px] font-black uppercase">TOP_</span>
            </div>
          </button>

          {/* Secure Meta Tag */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
             <span className="font-mono text-[7px] tracking-[0.3em] text-primary bg-black/80 px-2 py-0.5 rounded border border-primary/20">NAV_UPLOAD_01</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
