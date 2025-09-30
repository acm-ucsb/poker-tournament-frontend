"use client";

import { PokerPlayer } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { PlayingCard } from "./PlayingCard";

type Props = {
  player: PokerPlayer;
  className?: string;
};

export function PlayerPosition({ player, className }: Props) {
  const getActionText = () => {
    if (!player.lastAction) return "";

    switch (player.lastAction) {
      case "fold":
        return "FOLD";
      case "check":
        return "CHECK";
      case "call":
        return "CALL";
      case "bet":
        return "BET";
      case "raise":
        return "RAISE";
      case "all-in":
        return "ALL-IN";
      default:
        return "";
    }
  };

  return (
    <div className={cn("flex flex-col items-center space-y-2", className)}>
      {/* Player info header */}
      <div className="flex flex-col items-center space-y-1">
        {/* Team name */}
        <div
          className={
            "text-sm font-medium inline-flex items-center justify-center gap-1.5"
          }
        >
          {player.teamName}
          {/* Special position indicators */}
          {player.isDealer && (
            <Badge
              variant={"default"}
              className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold"
            >
              D
            </Badge>
          )}
          {player.isSmallBlind && (
            <Badge
              variant={"default"}
              className="w-6 h-6 bg-amber-300 rounded-full flex items-center justify-center text-[11px] font-bold"
            >
              SB
            </Badge>
          )}
          {player.isBigBlind && (
            <Badge
              variant={"default"}
              className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-[11px] font-bold"
            >
              BB
            </Badge>
          )}
        </div>

        {/* Chips */}
        <Badge variant={"default"} className="rounded-full bg-white/70">
          {player.chips.toLocaleString()} chips
        </Badge>
      </div>

      {/* Player cards */}
      <div className="flex space-x-1">
        {player.cards ? (
          player.cards.map((card, index) => (
            <PlayingCard key={index} card={card} className="w-14 h-20" />
          ))
        ) : (
          <>
            <PlayingCard faceDown className="w-14 h-20" />
            <PlayingCard faceDown className="w-14 h-20" />
          </>
        )}
      </div>

      {/* Current bet display */}
      {player.currentBet > 0 && (
        <div className="bg-gray-800/80 backdrop-blur-sm rounded px-2 py-1 border border-gray-600">
          <div className="text-xs text-gray-300">bet {player.currentBet}</div>
        </div>
      )}

      {/* Action indicator */}
      {player.lastAction && (
        <div
          className={cn(
            "text-xs font-bold px-2 py-1 rounded",
            player.lastAction === "fold"
              ? "text-red-400 bg-red-900/30"
              : player.isCurrentPlayer
                ? "text-green-400 bg-green-900/30"
                : "text-gray-400 bg-gray-800/50"
          )}
        >
          {getActionText()}
        </div>
      )}
    </div>
  );
}
