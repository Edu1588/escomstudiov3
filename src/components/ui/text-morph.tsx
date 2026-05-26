import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const TextMorph = ({ words, color = '#2EFF00', className }: { words: string[], color?: string, className?: string }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timeout = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 4000); 
    return () => clearInterval(timeout);
  }, [words.length]);

  return (
    <span className={`relative inline-grid ${className || ''}`} style={{ perspective: '600px', alignContent: 'center', justifyContent: 'center' }}>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={index}
          initial={{ rotateX: -90, y: 30, opacity: 0, filter: 'blur(8px)' }}
          animate={{ 
            rotateX: 0,
            y: 0, 
            opacity: 1, 
            filter: 'blur(0px)'
          }}
          exit={{ 
            rotateX: 90,
            y: -30, 
            opacity: 0, 
            filter: 'blur(8px)',
            position: 'absolute'
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }} 
          className="col-start-1 row-start-1"
          style={{ color, willChange: 'transform, opacity, filter', transformOrigin: 'center center' }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
      {/* Invisible element to define max width to avoid layout shifts */}
      <span className="invisible col-start-1 row-start-1 pointer-events-none" aria-hidden="true">
        {words.reduce((a, b) => a.length > b.length ? a : b)}
      </span>
    </span>
  );
};

