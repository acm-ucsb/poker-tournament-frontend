"use client";

import { PokerGameState } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { PlayingCard } from "./PlayingCard";
import { PlayerPosition } from "./PlayerPosition";

type Props = {
  gameState: PokerGameState;
  className?: string;
};

export function PokerTable({ gameState, className }: Props) {
  // Calculate player positions around the table (elliptical layout)
  const getPlayerPosition = (index: number, totalPlayers: number) => {
    const angle = (index * 360) / totalPlayers - 90; // Start from top
    const radiusX = 38; // Horizontal radius percentage (reduced to keep inside)
    const radiusY = 30; // Vertical radius percentage (reduced to keep inside)
    const x = 50 + radiusX * Math.cos((angle * Math.PI) / 180);
    const y = 50 + radiusY * Math.sin((angle * Math.PI) / 180);

    return {
      left: `${x}%`,
      top: `${y}%`,
      transform: "translate(-50%, -50%)",
    };
  };

  const getPhaseDisplayName = (phase: PokerGameState["phase"]) => {
    switch (phase) {
      case "preflop":
        return "Pre-Flop";
      case "flop":
        return "Flop";
      case "turn":
        return "Turn";
      case "river":
        return "River";
      case "showdown":
        return "Showdown";
      default:
        return phase;
    }
  };

  return (
    <div className={cn("relative w-full mx-auto", className)}>
      {/* Main table area */}
      <div className="h-[700px] rounded-full bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-950">
        {/* Central area with community cards and pot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center space-y-4">
          {/* Pot display */}
          <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg px-6 py-3 border border-gray-700">
            <div className="text-center">
              <div className="text-xs text-gray-300 uppercase tracking-wide">
                Pot
              </div>
              <div className="text-xl font-bold text-white">
                ${gameState.pot.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Community cards */}
          <div className="flex space-x-2">
            {gameState.communityCards.length > 0 ? (
              gameState.communityCards.map((card, index) => (
                <PlayingCard
                  key={index}
                  card={card}
                  className="w-14 h-20 shadow-lg"
                />
              ))
            ) : (
              // Placeholder for community cards
              <div className="flex space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-14 h-20 rounded-lg border-2 border-dashed border-slate-600/50"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Players positioned around the table */}
        {gameState.players.map((player, index) => (
          <div
            key={player.id}
            className="absolute"
            style={getPlayerPosition(index, gameState.players.length)}
          >
            <PlayerPosition player={player} />
          </div>
        ))}
      </div>
    </div>
  );
}
