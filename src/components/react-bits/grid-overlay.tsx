import { cn } from "@/lib/utils";

/** Fine-line grid system with a soft radial mask. */
export function GridOverlay({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 swan-grid",
        className
      )}
    />
  );
}
