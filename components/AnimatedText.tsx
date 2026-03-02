"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText);

interface AnimatedCopyProps {
  children: React.ReactNode;
  colorDim?: string;
  colorLit?: string;
  className?: string;
  start?: string;
  end?: string;
}

export default function AnimatedCopy({
  children,
  colorDim = "#444444",
  colorLit = "#ffffff",
  className,
  start = "top 85%",
  end = "top 20%",
}: AnimatedCopyProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const elements = Array.from(container.children) as HTMLElement[];
      if (elements.length === 0) return;

      // Split every child element into words, then chars
      const allWords: HTMLElement[] = [];
      const splits: SplitText[] = [];

      elements.forEach((el) => {
        const split = SplitText.create(el, {
          type: "words",
          wordsClass: "anim-word",
        });
        splits.push(split);
        allWords.push(...(split.words as HTMLElement[]));
      });

      const total = allWords.length;

      // Start all words dim
      gsap.set(allWords, { color: colorDim });

      ScrollTrigger.create({
        trigger: container,
        start,
        end,
        scrub: 1,
        onUpdate: (self) => {
          // How many words should be lit at this scroll position
          const litCount = Math.round(self.progress * total);

          allWords.forEach((word, i) => {
            gsap.set(word, {
              color: i < litCount ? colorLit : colorDim,
            });
          });
        },
      });

      return () => {
        splits.forEach((s) => s.revert());
      };
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}