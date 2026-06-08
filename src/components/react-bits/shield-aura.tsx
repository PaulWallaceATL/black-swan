import { cn } from "@/lib/utils";

/** Soft shield-like geometry with a pulsing protective glow. */
export function ShieldAura({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("relative grid place-items-center", className)}
    >
      <div className="absolute size-full rounded-full bg-violet/20 blur-2xl animate-pulse-glow" />
      <svg
        viewBox="0 0 120 132"
        fill="none"
        className="relative size-full drop-shadow-[0_0_28px_oklch(0.64_0.23_295/0.35)]"
      >
        <defs>
          <linearGradient id="shieldStroke" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.86 0.045 350)" />
            <stop offset="55%" stopColor="oklch(0.64 0.23 295)" />
            <stop offset="100%" stopColor="oklch(0.52 0.15 351)" />
          </linearGradient>
          <linearGradient id="shieldFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.64 0.23 295 / 0.18)" />
            <stop offset="100%" stopColor="oklch(0.52 0.15 351 / 0.05)" />
          </linearGradient>
        </defs>
        <path
          d="M60 4 110 24V64c0 34-22 52-50 64C32 116 10 98 10 64V24L60 4Z"
          fill="url(#shieldFill)"
          stroke="url(#shieldStroke)"
          strokeWidth="1.5"
        />
        <path
          d="M60 22 88 33v28c0 21-13 32-28 39-15-7-28-18-28-39V33l28-11Z"
          stroke="oklch(0.86 0.045 350 / 0.5)"
          strokeWidth="0.75"
          fill="none"
        />
      </svg>
    </div>
  );
}
