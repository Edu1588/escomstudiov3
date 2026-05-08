import { motion } from "framer-motion";
import * as React from "react";

export function TextRotateEntrance({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <span style={{ display: "inline-flex", flexWrap: "wrap", gap: "0.25em" }}>
      {words.map((word, i) => (
        <span key={i} style={{ display: "inline-flex", overflow: "hidden" }}>
          <motion.span
            initial={{ y: "120%", opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
            style={{ display: "inline-block" }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
