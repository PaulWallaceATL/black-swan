import { cn } from "@/lib/utils";

/**
 * Black Swan brand glyph — an elegant swan rendered with the brand gradient.
 * When `flap` is set, the wing pivots to simulate a wing-beat (used by the
 * page loader). The body, neck and head are static; only the wing animates.
 */
export function SwanGlyph({
  className,
  flap = false,
}: {
  className?: string;
  flap?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id="swanFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.93 0.03 330)" />
          <stop offset="50%" stopColor="oklch(0.66 0.23 295)" />
          <stop offset="100%" stopColor="oklch(0.55 0.16 351)" />
        </linearGradient>
        <linearGradient id="swanWing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.88 0.05 340)" />
          <stop offset="100%" stopColor="oklch(0.6 0.2 300)" />
        </linearGradient>
      </defs>

      {/* Body + neck + head silhouette (facing right) */}
      <path
        d="M8 44
           C 8 35 15 29 25 30
           C 20 26 17 20 19 14
           C 21 8 27 6 31 9
           C 28 11 28 15 32 18
           C 38 22 43 28 43 36
           C 49 35 51 31 50 27
           C 52 33 49 39 41 41
           C 33 47 17 49 8 44 Z"
        fill="url(#swanFill)"
      />

      {/* Beak */}
      <path d="M30 9 L38 8 L32 14 Z" fill="oklch(0.74 0.19 45)" />

      {/* Eye */}
      <circle cx="27" cy="13" r="1.3" fill="oklch(0.2 0.02 320)" />

      {/* Wing (animated) */}
      <path
        d="M16 41
           C 23 33 34 33 41 39
           C 34 36 25 37 19 43
           C 17 43 16 42 16 41 Z"
        fill="url(#swanWing)"
        className={cn(flap && "swan-wing")}
        style={
          flap
            ? { transformBox: "fill-box", transformOrigin: "22% 88%" }
            : undefined
        }
      />
    </svg>
  );
}
