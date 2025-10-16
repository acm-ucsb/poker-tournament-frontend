"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { PlayingCard } from "./PlayingCard";
import { Team } from "@/lib/types";
import { useGameState } from "@/providers/GameStateProvider";
import { LoaderComponent } from "../LoaderComponent";
import { formatChips } from "@/lib/util/util";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

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

  // Determine special positions
  const isSmallBlind = gameState.index_of_small_blind === currentPlayerIndex;
  const isBigBlind =
    (gameState.index_of_small_blind + 1) % gameState.players.length ===
    currentPlayerIndex;
  const isDealer =
    (gameState.index_of_small_blind - 1 + gameState.players.length) %
      gameState.players.length ===
    currentPlayerIndex;

  const currentBet = gameState.bet_money[currentPlayerIndex] ?? 0;
  const currentHeldMoney = gameState.held_money[currentPlayerIndex] ?? 0;

  const getActionBadge = () => {
    // Check if no action has occurred yet
    if (gameState.index_to_action <= currentPlayerIndex && currentBet === 0)
      return {
        action: null,
        amount: 0,
        component: null,
      };

    // Calculate the highest bet made BEFORE this player's turn
    const maxBetBeforePlayer = Math.max(
      ...gameState.bet_money.slice(0, currentPlayerIndex),
      0 // Include 0 in case this is the first player
    );

    // Check for fold
    if (currentBet === -1) {
      return {
        action: "fold",
        amount: 0,
        component: (
          <Badge variant={"default"} className="rounded-full bg-blue-100">
            fold
          </Badge>
        ),
      };
    }

    // Check for check (bet is 0 and there's no bet to match)
    if (currentBet === 0) {
      return {
        action: "check",
        amount: 0,
        component: (
          <Badge variant={"default"} className="rounded-full bg-blue-100">
            check
          </Badge>
        ),
      };
    }

    // Check for all-in (player has 0 chips left after betting)
    if (currentHeldMoney === 0 || currentBet >= currentHeldMoney) {
      return {
        action: "all-in",
        amount: currentBet,
        component: (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant={"default"} className="rounded-full bg-blue-100">
                all-in {formatChips(currentBet)}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <span>{formatChips(currentBet, false)} chips</span>
            </TooltipContent>
          </Tooltip>
        ),
      };
    }

    // Check for call (matches the highest bet before their turn)
    if (currentBet === maxBetBeforePlayer) {
      return {
        action: "call",
        amount: currentBet,
        component: (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant={"default"} className="rounded-full bg-blue-100">
                call {formatChips(currentBet)}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <span>{formatChips(currentBet, false)} chips</span>
            </TooltipContent>
          </Tooltip>
        ),
      };
    }

    // Otherwise it's a raise
    return {
      action: "raise",
      amount: currentBet,
      component: (
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant={"default"} className="rounded-full bg-blue-100">
              raise {formatChips(currentBet)}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <span>{formatChips(currentBet, false)} chips</span>
          </TooltipContent>
        </Tooltip>
      ),
    };
  };

  return (
    <div className={cn("flex flex-col items-center space-y-2", className)}>
      {/* Player info header */}
      <div className="flex flex-col items-center gap-y-1.5">
        {/* Action indicator */}
        {currentPlayerIndex ===
          (gameState.index_to_action + 2) % gameState.players.length && (
          <Badge variant={"default"} className="rounded-full bg-red-100">
            action
          </Badge>
        )}
        {getActionBadge().action && getActionBadge().component}

        {/* Team name */}
        <div
          className={
            "text-sm font-medium flex flex-col items-center justify-center gap-1.5"
          }
        >
          <span className="font-extrabold">{team.name}</span>
          <div className="flex gap-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant={"default"} className="rounded-full bg-white/90">
                  {formatChips(currentHeldMoney)} chips
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <span>{formatChips(currentHeldMoney, false)} chips</span>
              </TooltipContent>
            </Tooltip>

            {/* Special position indicators */}
            {isDealer && (
              <Badge
                variant={"default"}
                className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold bg-white"
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
        </div>
      </div>

      {/* Player cards */}
      <div className="flex gap-[clamp(0.15rem,0.3vw,0.375rem)]">
        {gameState.players_cards[currentPlayerIndex] &&
        gameState.players_cards[currentPlayerIndex].length === 2 ? (
          // && gameState.players[currentPlayerIndex].id === data?.team_id
          gameState.players_cards[currentPlayerIndex].map((card, index) => (
            <PlayingCard key={index} card={card} />
          ))
        ) : (
          <>
            <PlayingCard faceDown />
            <PlayingCard faceDown />
          </>
        )}
      </div>
    </div>
  );
}
