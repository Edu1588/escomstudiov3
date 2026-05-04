"use client";

import React, { useState, useEffect } from "react";
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface TextMarqueeProps {
  children: React.ReactNode[];
  speed?: number;
  className?: string;
  prefix?: React.ReactNode;
  height?: number;
}

export function TextMarquee({
  children,
  speed = 1.5,
  className,
  prefix,
  height = 40,
}: TextMarqueeProps) {
  const [index, setIndex] = useState(0);
  const count = React.Children.count(children);

  useEffect(() => {
    // Determine the scroll interval from speed.
    // By default, it pauses for half a second and then scrolls taking ~0.5s.
    const interval = setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, Math.max(speed * 1000, 1000)); // Minimum 1 second interval to allow for 0.5s animation
    return () => clearInterval(interval);
  }, [count, speed]);

  const childrenArray = React.Children.toArray(children);

  return (
    <div className={cn("flex relative", className)}>
      <div 
        className="flex relative overflow-hidden flex-row gap-2 items-center w-min" 
        style={{ height: `${height}px` }}
      >
        {prefix && (
          <div className="whitespace-nowrap size-auto relative flex items-center h-full">
            {prefix}
          </div>
        )}
        <div 
          className="relative w-auto flex-1 h-full min-w-[200px] overflow-hidden"
          style={{
            maskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)"
          }}
        >
          <AnimatePresence>
            <motion.div
              key={index}
              initial={{ y: height, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -height, opacity: 0 }}
              transition={{ ease: "easeInOut", duration: 0.5 }}
              className="absolute left-0 top-0 flex items-center h-full whitespace-nowrap"
            >
              {childrenArray[index]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
