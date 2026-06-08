import { cn } from "@/lib/utils";
import { SwanGlyph } from "@/components/swan";

/** Black Swan glyph wordmark. */
export function Logo({
  className,
  withWordmark = true,
}: {
  className?: string;
  withWordmark?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <SwanGlyph className="size-7" />
      {withWordmark && (
        <span className="font-display text-lg font-semibold tracking-tight text-foreground">
          Black Swan
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
