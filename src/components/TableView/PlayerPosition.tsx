"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { PlayingCard } from "./PlayingCard";
import { Team } from "@/lib/types";
import { useGameState } from "@/providers/GameStateProvider";
import { LoaderComponent } from "../LoaderComponent";

type Props = {
  team: Team;
  className?: string;
};

export function PlayerPosition({ team, className }: Props) {
  const { gameState } = useGameState();

  if (!gameState) {
    return <LoaderComponent />;
  }

  const currentPlayerIndex = gameState.players.findIndex(
    (p) => p.id === team.id
  );

  const getActionText = () => {
    if (gameState.index_to_action <= currentPlayerIndex) return "";

    switch (gameState.bet_money[currentPlayerIndex]) {
      case -1:
        return "FOLD";
      case 0:
        return "CHECK";
      case gameState.held_money[currentPlayerIndex]:
        return "ALL-IN";
      case gameState.bet_money[currentPlayerIndex - 1]:
        return "CALL";
      default:
        return "RAISE";
    }
  };

  const isSmallBlind = gameState.index_of_small_blind === currentPlayerIndex;
  const isBigBlind =
    (gameState.index_of_small_blind + 1) % gameState.players.length ===
    currentPlayerIndex;
  const isDealer =
    (gameState.index_of_small_blind - 1 + gameState.players.length) %
      gameState.players.length ===
    currentPlayerIndex;
  const isCurrentPlayer = gameState.index_to_action === currentPlayerIndex;

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
          {team.name}
          {/* Special position indicators */}
          {isDealer && (
            <Badge
              variant={"default"}
              className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold"
            >
              D
            </Badge>
          )}
          {isSmallBlind && (
            <Badge
              variant={"default"}
              className="w-6 h-6 bg-amber-300 rounded-full flex items-center justify-center text-[11px] font-bold"
            >
              SB
            </Badge>
          )}
          {isBigBlind && (
            <Badge
              variant={"default"}
              className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-[11px] font-bold"
            >
              BB
            </Badge>
          )}
        </div>
        Chips
        <Badge variant={"default"} className="rounded-full bg-white/70">
          {gameState.held_money[currentPlayerIndex]} chips
        </Badge>
      </div>

      {/* Player cards */}
      <div className="flex space-x-1">
        {gameState.players_cards[currentPlayerIndex] ? (
          gameState.players_cards[currentPlayerIndex].map((card, index) => (
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
      {/* {team.currentBet > 0 && (
        <div className="bg-gray-800/80 backdrop-blur-sm rounded px-2 py-1 border border-gray-600">
          <div className="text-xs text-gray-300">bet {team.currentBet}</div>
        </div>
      )} */}

      {/* Action indicator */}
      {/* {team.lastAction && (
        <div
          className={cn(
            "text-xs font-bold px-2 py-1 rounded",
            team.lastAction === "fold"
              ? "text-red-400 bg-red-900/30"
              : team.isCurrentPlayer
                ? "text-green-400 bg-green-900/30"
                : "text-gray-400 bg-gray-800/50"
          )}
        >
          {getActionText()}
        </div>
      )} */}
    </div>
  );
}
