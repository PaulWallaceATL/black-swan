"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/use-in-view";

type Direction = "up" | "down" | "left" | "right" | "none";

const offsets: Record<Direction, string> = {
  up: "translate-y-8",
  down: "-translate-y-8",
  left: "translate-x-8",
  right: "-translate-x-8",
  none: "",
};

type ScrollRevealProps = React.ComponentProps<"div"> & {
  direction?: Direction;
  delay?: number;
  as?: "div" | "section" | "li" | "ul" | "article" | "header";
};

/** Reveals children with a soft fade + translate once they enter the viewport. */
export function ScrollReveal({
  className,
  children,
  direction = "up",
  delay = 0,
  as = "div",
  style,
  ...props
}: ScrollRevealProps) {
  const { ref, inView } = useInView<HTMLElement>();
  const Comp = as as React.ElementType;

  return React.createElement(
    Comp,
    {
      ref,
      style: { transitionDelay: `${delay}ms`, ...style },
      className: cn(
        "transition-all duration-700 ease-out will-change-transform motion-reduce:transition-none",
        inView
          ? "opacity-100 translate-x-0 translate-y-0"
          : cn("opacity-0", offsets[direction]),
        className
      ),
      ...props,
    },
    children
  );
}
