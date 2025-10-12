"use client";

import { PokerGameState } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PlayerPosition } from "./PlayerPosition";
import { RevealingCard, CARD_DIMENSIONS_CLASS } from "./RevealingCard";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  gameState: PokerGameState;
  className?: string;
};

export function PokerTable({ gameState, className }: Props) {
  // Calculate player positions around the table (elliptical layout)
  const getPlayerPosition = (index: number, totalPlayers: number) => {
    const angle = (index * 360) / totalPlayers - 90; // Start from top
    const radiusX = 40; // Horizontal radius percentage (reduced to keep inside)
    const radiusY = 32; // Vertical radius percentage (reduced to keep inside)
    const x = 50 + radiusX * Math.cos((angle * Math.PI) / 180);
    const y = 50 + radiusY * Math.sin((angle * Math.PI) / 180);

    return {
      left: `${x}%`,
      top: `${y}%`,
      transform: "translate(-50%, -50%)",
    };
  };

  return (
    <div className={cn("relative w-full mx-auto", className)}>
      {/* Main table area */}
      <div className="h-[800px] rounded-full bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-950">
        {/* Central area with community cards and pot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center space-y-4">
          {/* Pot display with main pot and side pots */}
          <div className="flex flex-wrap gap-2 justify-center">
            {gameState.pots.map((pot, index) => {
              const isMainPot = index === 0;
              const eligibleTeams = gameState.players.filter((player) =>
                pot.players.includes(player.id)
              );

              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-700 hover:border-gray-500 transition-colors cursor-help">
                      <div className="text-center">
                        <div className="text-xs text-gray-300 uppercase tracking-wide">
                          {isMainPot ? "Main Pot" : `Side Pot ${index}`}
                        </div>
                        <div className="text-lg font-bold text-white">
                          ${pot.value.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="space-y-1">
                      <p className="font-semibold">Eligible Teams:</p>
                      <ul className="text-xs space-y-0.5">
                        {eligibleTeams.map((team) => (
                          <li key={team.id}>• {team.name}</li>
                        ))}
                      </ul>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>

          {/* Community cards */}
          <div className="flex gap-[clamp(0.25rem,0.5vw,0.5rem)]">
            {Array.from({ length: 5 }).map((_, index) => {
              const card = gameState.community_cards[index];

              if (!card) {
                return (
                  <div
                    key={`placeholder-${index}`}
                    className={cn(
                      CARD_DIMENSIONS_CLASS,
                      "rounded-lg border-2 border-dashed border-slate-600/60 bg-black/20 backdrop-blur-sm"
                    )}
                  />
                );
              }

              return (
                <RevealingCard
                  key={`${index}-${card.rank}${card.suit}`}
                  card={card}
                  delay={index * 140}
                  className="shadow-lg"
                />
              );
            })}
          </div>
        </div>

        {/* Players positioned around the table */}
        {gameState.players.map((player, index) => (
          <div
            key={player.id}
            className="absolute"
            style={getPlayerPosition(index, gameState.players.length)}
          >
            <PlayerPosition team={player} />
          </div>
        ))}
      </div>
    </div>
  );
}
