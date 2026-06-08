"use client";

import { useEffect, useRef, useState } from "react";

type Options = {
  /** Fraction of the element that must be visible to trigger. */
  threshold?: number;
  /** Margin around the root, e.g. "0px 0px -10% 0px". */
  rootMargin?: string;
  /** Only fire once, then stop observing. */
  once?: boolean;
};

/**
 * Lightweight IntersectionObserver hook used to drive scroll-reveal motion
 * without pulling in an animation library.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.18,
  rootMargin = "0px 0px -8% 0px",
  once = true,
}: Options = {}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      // Fallback for unsupported environments: reveal on next frame.
      const raf = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(raf);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setInView(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, inView } as const;
}
