"use client";

import { useEffect, useState, useMemo } from "react";

import { PlayingCard as CardType } from "@/lib/types";
import { cn } from "@/lib/utils";

import { PlayingCard } from "./PlayingCard";

const CARD_DIMENSIONS_CLASS =
  "w-[clamp(3rem,6vw,5rem)] h-[clamp(4.4rem,9vw,7rem)]";

type RevealingCardProps = {
  card: CardType;
  delay?: number;
  className?: string;
};

function usePrefersReducedMotion() {
  const mediaQuery = useMemo(
    () =>
      typeof window === "undefined"
        ? null
        : window.matchMedia("(prefers-reduced-motion: reduce)"),
    []
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => mediaQuery?.matches ?? false
  );

  useEffect(() => {
    if (!mediaQuery) return;

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [mediaQuery]);

  return prefersReducedMotion;
}

export function RevealingCard({
  card,
  delay = 0,
  className,
}: RevealingCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsFlipped(true);
      return;
    }

    setIsFlipped(false);
    const timeout = window.setTimeout(() => setIsFlipped(true), delay);

    return () => window.clearTimeout(timeout);
  }, [card.rank, card.suit, delay, prefersReducedMotion]);

  return (
    <div
      className={cn(
        CARD_DIMENSIONS_CLASS,
        "relative [perspective:1200px]",
        className
      )}
    >
      <div
        className={cn(
          "relative size-full transition-transform duration-[600ms] ease-[cubic-bezier(0.65,0,0.35,1)] will-change-transform [transform-style:preserve-3d]",
          isFlipped
            ? "[transform:rotateY(180deg)]"
            : "[transform:rotateY(0deg)]"
        )}
      >
        <div className="absolute inset-0 rounded-[inherit] [backface-visibility:hidden] [transform-style:preserve-3d]">
          <PlayingCard faceDown className="h-full w-full" />
        </div>
        <div className="absolute inset-0 rounded-[inherit] [backface-visibility:hidden] [transform-style:preserve-3d] [transform:rotateY(180deg)]">
          <PlayingCard card={card} className="h-full w-full" />
        </div>
      </div>
    </div>
  );
}

export { CARD_DIMENSIONS_CLASS };
