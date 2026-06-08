"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Mounts heavy (WebGL) children only while the wrapper is near the viewport,
 * and unmounts them once it scrolls away. This keeps the number of live
 * WebGL contexts low when several React Bits Pro shader backgrounds are used
 * across the page. Children fade in to mask mount/unmount.
 */
export function SceneMount({
  children,
  className,
  rootMargin = "240px",
}: {
  children: React.ReactNode;
  className?: string;
  rootMargin?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      const raf = requestAnimationFrame(() => setActive(true));
      return () => cancelAnimationFrame(raf);
    }
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} aria-hidden="true" className={className}>
      <div
        className={cn(
          "h-full w-full transition-opacity duration-1000",
          active ? "opacity-100" : "opacity-0",
        )}
      >
        {active ? children : null}
      </div>
    </div>
  );
}
