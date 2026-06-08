"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/use-in-view";

type TextRevealProps = {
  text: string;
  className?: string;
  /** Per-word stagger in ms. */
  stagger?: number;
  as?: "h1" | "h2" | "p" | "span";
};

/** Staggered word-by-word reveal for cinematic headline copy. */
export function TextReveal({
  text,
  className,
  stagger = 42,
  as = "h1",
}: TextRevealProps) {
  const { ref, inView } = useInView<HTMLHeadingElement>();
  const words = text.split(" ");
  const Comp = as;

  return (
    <Comp ref={ref} className={cn("[text-wrap:balance]", className)}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden align-bottom"
        >
          <span
            className={cn(
              "inline-block transition-all duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform motion-reduce:transition-none",
              inView
                ? "translate-y-0 opacity-100"
                : "translate-y-[110%] opacity-0"
            )}
            style={{ transitionDelay: `${i * stagger}ms` }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        </span>
      ))}
    </Comp>
  );
}
