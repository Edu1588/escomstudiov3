import { motion } from "motion/react";

const row1 = [
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1493421416290-99a87240a79a?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=400",
];

const row2 = [
  "https://images.unsplash.com/photo-1522542550221-31fd19fe4af0?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400",
];

export default function ThumbCarousel() {
  return (
    <div className="py-12 bg-black overflow-hidden flex flex-col gap-6">
      <div className="flex whitespace-nowrap">
        <motion.div
          animate={{ x: [0, -1035] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex gap-6 pr-6"
        >
          {[...row1, ...row1].map((src, i) => (
            <div key={i} className="w-[300px] h-[200px] rounded-none overflow-hidden tech-border shrink-0 grayscale hover:grayscale-0 transition-all duration-500">
              <img src={src} className="w-full h-full object-cover" alt="Project thumb" referrerPolicy="no-referrer" />
            </div>
          ))}
        </motion.div>
      </div>

      <div className="flex whitespace-nowrap">
        <motion.div
          animate={{ x: [-1035, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex gap-6 pr-6"
        >
          {[...row2, ...row2].map((src, i) => (
            <div key={i} className="w-[300px] h-[200px] rounded-none overflow-hidden tech-border shrink-0 grayscale hover:grayscale-0 transition-all duration-500">
              <img src={src} className="w-full h-full object-cover" alt="Project thumb" referrerPolicy="no-referrer" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
