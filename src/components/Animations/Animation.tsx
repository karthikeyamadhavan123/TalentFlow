import type { AnimationProps } from "@/types";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const Animation = ({
  text,
  color,
  highlightWord,
  highlightClass,
}: AnimationProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setKey((prev) => prev + 1);
      }, text.length * 100 + 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView, key, text.length]);

  // Split text into segments for highlighting
  const segments = highlightWord
    ? text.split(new RegExp(`(${highlightWord})`, "gi"))
    : [text];

  let charIndex = 0;

  return (
    <div ref={ref} className="flex flex-wrap justify-center">
      {segments.map((segment, segIdx) => {
        const isHighlighted =
          highlightWord &&
          segment.toLowerCase() === highlightWord.toLowerCase();
        const chars = segment.split("");

        return (
          <div key={`${key}-${segIdx}`} className="flex flex-wrap">
            {chars.map((char) => {
              const delay =
                char === " "
                  ? charIndex * 0.1 + 0.2
                  : charIndex * 0.15;
              const currentCharIndex = charIndex;
              charIndex++;

              return (
                <motion.span
                  key={`${key}-${currentCharIndex}`}
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.1, delay }}
                  className={isHighlighted ? highlightClass : color}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Animation;
