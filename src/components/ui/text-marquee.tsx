"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface TextMarqueeProps {
  children: React.ReactNode[];
  speed?: number; // Time to pause on each word
  className?: string;
  prefix?: React.ReactNode;
  height?: number;
}

export function TextMarquee({
  children,
  speed = 1.5, // 1.5 seconds pause by default
  className,
  prefix,
  height = 80,
}: TextMarqueeProps) {
  const [index, setIndex] = useState(0);
  const count = React.Children.count(children);
  const childArray = React.Children.toArray(children);

  useEffect(() => {
    if (count <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % count);
    }, speed * 1000);
    return () => clearInterval(interval);
  }, [count, speed]);

  return (
    <div className={cn("flex relative", className)}>
      <div 
        className="flex relative overflow-hidden flex-row gap-2 items-center"
        style={{ height: `${height}px` }}
      >
        {prefix && (
          <div className="whitespace-pre flex-shrink-0 relative">
            {prefix}
          </div>
        )}
        <div
          className="relative flex-shrink-0 overflow-hidden flex items-center"
          style={{ height: `${height}px` }}
        >
          <AnimatePresence mode="popLayout">
            <motion.div
              key={index}
              initial={{ y: height, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -height, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="flex items-center whitespace-nowrap h-full pr-4"
            >
              {childArray[index]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
