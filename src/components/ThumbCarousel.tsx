import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { getPortfolioProjects } from "../firebase";

export default function ThumbCarousel() {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    getPortfolioProjects().then(data => {
      const destaqueImages = data.filter(p => p.destaque && p.image).map(p => p.image);
      if (destaqueImages.length > 0) {
        setImages(destaqueImages);
      } else {
        setImages([
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400",
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400",
          "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=400"
        ]);
      }
    });
  }, []);

  if (images.length === 0) return null;

  // We need enough images to make two rows that scroll smoothly
  // We'll duplicate the images array to have at least 5 for each row
  const row1 = Array.from({ length: Math.ceil(5 / images.length) * images.length }, (_, i) => images[i % images.length]);
  const row2 = [...row1].reverse(); // reverse for some variation

  return (
    <div className="py-12 bg-black overflow-hidden flex flex-col gap-6">
      <div className="flex whitespace-nowrap">
        <motion.div
          animate={{ x: [0, -1035] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex gap-6 pr-6"
        >
          {[...row1, ...row1, ...row1, ...row1].map((src, i) => (
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
          {[...row2, ...row2, ...row2, ...row2].map((src, i) => (
            <div key={i} className="w-[300px] h-[200px] rounded-none overflow-hidden tech-border shrink-0 grayscale hover:grayscale-0 transition-all duration-500">
              <img src={src} className="w-full h-full object-cover" alt="Project thumb" referrerPolicy="no-referrer" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
