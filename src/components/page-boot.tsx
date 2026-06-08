"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { SwanGlyph } from "@/components/swan";

/**
 * First-load experience: a full-screen swan loader (the swan beats its wing)
 * that lifts away to reveal the page fading/settling in. Loader timing and the
 * content reveal are driven by a single state machine so they stay in sync.
 */
export function PageBoot({ children }: { children: React.ReactNode }) {
  const [revealed, setRevealed] = React.useState(false);
  const [removed, setRemoved] = React.useState(false);

  React.useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const showMs = reduce ? 250 : 2000;
    const revealTimer = window.setTimeout(() => setRevealed(true), showMs);
    return () => window.clearTimeout(revealTimer);
  }, []);

  React.useEffect(() => {
    if (!revealed) return;
    const removeTimer = window.setTimeout(() => setRemoved(true), 900);
    return () => window.clearTimeout(removeTimer);
  }, [revealed]);

  return (
    <>
      {!removed && (
        <div
          aria-hidden={revealed}
          role="status"
          aria-label="Loading Black Swan"
          className={cn(
            "fixed inset-0 z-[200] flex flex-col items-center justify-center gap-7 bg-background transition-all duration-700 ease-out",
            revealed
              ? "pointer-events-none -translate-y-2 opacity-0 blur-sm"
              : "opacity-100",
          )}
        >
          {/* Ambient glow behind the swan */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 size-[420px] -translate-x-1/2 -translate-y-[58%] rounded-full bg-violet/20 blur-[90px]"
          />

          <div className="swan-bob relative">
            <SwanGlyph flap className="size-24 drop-shadow-[0_8px_30px_rgba(160,107,255,0.35)]" />
          </div>

          <div className="relative flex flex-col items-center gap-3">
            <span className="font-display text-2xl font-semibold tracking-tight text-foreground">
              Black Swan
            </span>
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.34em] text-muted-foreground">
              Intelligence layer
            </span>
            {/* Indeterminate progress sweep */}
            <div className="mt-1 h-px w-40 overflow-hidden rounded-full bg-border/70">
              <div className="loader-sweep h-full w-1/3 rounded-full bg-gradient-to-r from-transparent via-violet to-transparent" />
            </div>
          </div>
        </div>
      )}

      {/* Opacity-only reveal — avoids creating a containing block that would
          break fixed/sticky descendants (grain overlay, sticky nav). */}
      <div
        className={cn(
          "transition-opacity duration-700 ease-out motion-reduce:transition-none",
          revealed ? "opacity-100" : "opacity-0",
        )}
      >
        {children}
      </div>
    </>
  );
}
