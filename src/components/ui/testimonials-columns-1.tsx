"use client";
import React from "react";
import { motion } from "motion/react";


export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: { text: string; image: string; name: string; role: string; }[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-transparent"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div className="p-10 border border-white/5 bg-white/[0.03] shadow-lg shadow-primary/10 max-w-xs w-full hover:bg-white/[0.05] hover:border-white/10 transition-all rounded-none" key={i}>
                  <div className="text-white/60 font-mono text-[10px] leading-relaxed uppercase tracking-wide">"{text}"</div>
                  <div className="flex items-center gap-4 mt-8">
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      className="h-10 w-10 border border-white/10 grayscale rounded-none"
                    />
                    <div className="flex flex-col overflow-hidden">
                      <div className="font-black text-[10px] uppercase truncate text-white">{name}</div>
                      <div className="text-white/20 text-[8px] font-mono uppercase tracking-[0.2em] truncate">{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};
