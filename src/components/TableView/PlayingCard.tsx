"use client";

import { PlayingCard as CardType, CardSuit } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  card?: CardType;
  faceDown?: boolean;
  className?: string;
};

const suitSymbols: Record<CardSuit, string> = {
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
  spades: "♠",
};

const suitColors: Record<CardSuit, string> = {
  hearts: "text-red-500",
  diamonds: "text-red-500",
  clubs: "text-gray-800",
  spades: "text-gray-800",
};

export function PlayingCard({ card, faceDown = false, className }: Props) {
  return (
    <div
      style={{
        backgroundColor: faceDown || !card ? undefined : "white",
        borderColor: faceDown || !card ? undefined : "black",
        borderStyle: faceDown || !card ? undefined : "solid",
        borderRadius: "0.25rem",
      }}
      className={cn("w-12 h-16 flex flex-col relative shadow-lg", className)}
    >
      {faceDown || !card ? (
        <>
          {/* Card back pattern */}
          <div
            style={{
              borderRadius: "inherit",
            }}
            className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center"
          >
            <div className="w-10 h-16 border border-gray-500 rounded bg-gray-700/50 flex items-center justify-center">
              <div className="w-6 h-12 bg-gray-600 rounded"></div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Top-left corner */}
          <div className="absolute top-1 left-1 flex flex-col items-center text-xs font-bold leading-none">
            <span className={cn("text-[14px]", suitColors[card.suit])}>
              {card.rank === "T" ? "10" : card.rank}
            </span>
            <span className={cn("text-[12px]", suitColors[card.suit])}>
              {suitSymbols[card.suit]}
            </span>
          </div>

          {/* Center symbol */}
          <div className="flex-1 flex items-center justify-center">
            <span className={cn("text-xl", suitColors[card.suit])}>
              {suitSymbols[card.suit]}
            </span>
          </div>

          {/* Bottom-right corner (rotated) */}
          <div className="absolute bottom-1 right-1 flex flex-col items-center text-xs font-bold leading-none transform rotate-180">
            <span className={cn("text-[14px]", suitColors[card.suit])}>
              {card.rank === "T" ? "10" : card.rank}
            </span>
            <span className={cn("text-[12px]", suitColors[card.suit])}>
              {suitSymbols[card.suit]}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
