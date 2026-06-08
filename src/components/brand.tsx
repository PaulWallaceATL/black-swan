import { cn } from "@/lib/utils";

/** Aegis shield wordmark. */
export function Logo({
  className,
  withWordmark = true,
}: {
  className?: string;
  withWordmark?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 32 36"
        fill="none"
        aria-hidden="true"
        className="size-7"
      >
        <defs>
          <linearGradient id="logoFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.86 0.045 350)" />
            <stop offset="55%" stopColor="oklch(0.64 0.23 295)" />
            <stop offset="100%" stopColor="oklch(0.52 0.15 351)" />
          </linearGradient>
        </defs>
        <path
          d="M16 1 30 7v11c0 9.5-6 14.5-14 18C8 32.5 2 27.5 2 18V7L16 1Z"
          fill="oklch(0.64 0.23 295 / 0.12)"
          stroke="url(#logoFill)"
          strokeWidth="1.5"
        />
        <path
          d="M16 10v14M11 17h10"
          stroke="url(#logoFill)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      {withWordmark && (
        <span className="font-display text-lg font-semibold tracking-tight text-foreground">
          Aegis
        </span>
      )}
    </span>
  );
}

/** Small eyebrow label used above section headings. */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/40 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground backdrop-blur",
        className
      )}
    >
      <span className="size-1.5 rounded-full bg-violet" />
      {children}
    </span>
  );
}
