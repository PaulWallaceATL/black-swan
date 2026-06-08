import { cn } from "@/lib/utils";

/** Subtle film-grain texture layered above gradients for a premium finish. */
export function Noise({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 z-[1] swan-noise opacity-[0.035] mix-blend-soft-light",
        className
      )}
    />
  );
}
