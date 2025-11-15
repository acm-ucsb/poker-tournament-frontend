"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { PlayingCard } from "./PlayingCard";
import { Team } from "@/lib/types";
import { useGameState } from "@/providers/GameStateProvider";
import { LoaderComponent } from "../LoaderComponent";
import { formatChips } from "@/lib/util/util";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useEffect, useRef, useState } from "react";

type Props = {
  team: Team;
  className?: string;
};

type PlayerActionData = {
  action: "fold" | "check" | "call" | "bet" | "raise" | "all-in" | null;
  amount: number;
};

export function PlayerPosition({ team, className }: Props) {
  const { gameState } = useGameState();

  // Track player actions for this betting round
  const [playerActions, setPlayerActions] = useState<PlayerActionData[]>([]);
  const prevBetMoneyRef = useRef<number[]>([]);
  const prevIndexToActionRef = useRef<number>(-1);
  const prevCommunityCardsLengthRef = useRef<number>(0);
  const prevPotTotalRef = useRef<number>(0);

  useEffect(() => {
    if (!gameState) return;

    const currentCommunityCardsLength = gameState.community_cards.length;
    const prevCommunityCardsLength = prevCommunityCardsLengthRef.current;

    // Calculate current and previous pot totals
    const currentPotTotal = gameState.pots.reduce(
      (sum, pot) => sum + pot.value,
      0
    );
    const prevPotTotal = prevPotTotalRef.current;

    // Reset actions when:
    // 1. Community cards change (new betting round), OR
    // 2. Pot total decreases significantly (hand ended and pot was distributed)
    //    This handles the case where everyone goes all-in or folds and no new cards come out
    const potWasDistributed =
      prevPotTotal > 0 && currentPotTotal < prevPotTotal * 0.5;

    if (
      currentCommunityCardsLength !== prevCommunityCardsLength ||
      potWasDistributed
    ) {
      setPlayerActions(
        gameState.players.map(() => ({ action: null, amount: 0 }))
      );
      prevBetMoneyRef.current = [...gameState.bet_money];
      prevIndexToActionRef.current = gameState.index_to_action;
      prevCommunityCardsLengthRef.current = currentCommunityCardsLength;
      prevPotTotalRef.current = currentPotTotal;
      return;
    }

    // Detect when index_to_action changes (a player just acted)
    if (
      gameState.index_to_action !== prevIndexToActionRef.current &&
      prevIndexToActionRef.current !== -1
    ) {
      const prevBetMoney = prevBetMoneyRef.current;
      const currentBetMoney = gameState.bet_money;

      // Calculate which player just acted
      const numPlayers = gameState.players.length;
      const playerWhoActed =
        ((prevIndexToActionRef.current % numPlayers) + numPlayers) % numPlayers;

      const currentBet = currentBetMoney[playerWhoActed] ?? 0;

      // Determine the max bet before this player's action
      const maxBetBeforeAction = Math.max(
        ...prevBetMoney.filter((bet) => bet !== -1),
        0
      );

      let detectedAction: PlayerActionData = { action: null, amount: 0 };

      if (currentBet === -1) {
        // Player folded
        detectedAction = { action: "fold", amount: 0 };
      } else if (currentBet === 0 && maxBetBeforeAction === 0) {
        // Player checked (no bet to call)
        detectedAction = { action: "check", amount: 0 };
      } else if (currentBet === 0 && maxBetBeforeAction > 0) {
        // This shouldn't happen in normal poker, but handle as check
        detectedAction = { action: "check", amount: 0 };
      } else if (currentBet > 0) {
        const currentHeldMoney = gameState.held_money[playerWhoActed] ?? 0;

        // Check for all-in
        if (currentHeldMoney === 0) {
          detectedAction = { action: "all-in", amount: currentBet };
        } else if (currentBet === maxBetBeforeAction) {
          // Player called
          detectedAction = { action: "call", amount: currentBet };
        } else if (currentBet > maxBetBeforeAction) {
          // Player bet or raised
          if (maxBetBeforeAction === 0) {
            detectedAction = { action: "bet", amount: currentBet };
          } else {
            detectedAction = { action: "raise", amount: currentBet };
          }
        }
      }

      setPlayerActions((prev) => {
        const updated = [...prev];
        // Initialize array if needed
        while (updated.length < gameState.players.length) {
          updated.push({ action: null, amount: 0 });
        }
        updated[playerWhoActed] = detectedAction;
        return updated;
      });
    }

    // Update refs
    prevBetMoneyRef.current = [...gameState.bet_money];
    prevIndexToActionRef.current = gameState.index_to_action;
    prevPotTotalRef.current = currentPotTotal;
  }, [gameState]);

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

  const isCurrentPlayerHuman =
    gameState.players[currentPlayerIndex].type === "human";

  const isCurrentPlayerFolded = currentBet === -1;

  const inferActionFromGameState = (): PlayerActionData => {
    // Stateless fallback: infer action from current game state
    // This is less accurate but allows users who just joined to see something
    // We only show badges when we're confident about the action

    // Check for fold (always certain)
    if (currentBet === -1) {
      return { action: "fold", amount: 0 };
    }

    // Check for all-in (certain if they have money in and chips are 0)
    if (currentHeldMoney === 0 && currentBet > 0) {
      return { action: "all-in", amount: currentBet };
    }

    // If player has bet money > 0, show "bet"
    // (can't distinguish call/raise/bet without history, but we know they committed chips)
    if (currentBet > 0) {
      return { action: "bet", amount: currentBet };
    }

    // For bet_money = 0, we can't reliably distinguish between:
    // - Player who checked
    // - Player who hasn't acted yet
    // So we show nothing in the stateless fallback for these cases
    // The stateful tracking will handle this correctly for live viewers

    return { action: null, amount: 0 };
  };

  const getActionBadge = () => {
    // Try to use statefully tracked action first (more accurate)
    let actionData = playerActions[currentPlayerIndex];

    // Fallback to stateless inference if no tracked action exists
    if (!actionData || !actionData.action) {
      actionData = inferActionFromGameState();
    }

    if (!actionData || !actionData.action) {
      return {
        action: null,
        amount: 0,
        component: null,
      };
    }

    const { action, amount } = actionData;

    // Return appropriate badge based on action
    switch (action) {
      case "fold":
        return {
          action: "fold",
          amount: 0,
          component: (
            <Badge variant={"default"} className="rounded-full bg-blue-100">
              fold
            </Badge>
          ),
        };

      case "check":
        return {
          action: "check",
          amount: 0,
          component: (
            <Badge variant={"default"} className="rounded-full bg-blue-100">
              check
            </Badge>
          ),
        };

      case "all-in":
        return {
          action: "all-in",
          amount,
          component: (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant={"default"} className="rounded-full bg-blue-100">
                  all-in {formatChips(amount)}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <span>{formatChips(amount, false)} chips</span>
              </TooltipContent>
            </Tooltip>
          ),
        };

      case "call":
        return {
          action: "call",
          amount,
          component: (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant={"default"} className="rounded-full bg-blue-100">
                  call {formatChips(amount)}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <span>{formatChips(amount, false)} chips</span>
              </TooltipContent>
            </Tooltip>
          ),
        };

      case "bet":
        return {
          action: "bet",
          amount,
          component: (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant={"default"} className="rounded-full bg-blue-100">
                  bet {formatChips(amount)}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <span>{formatChips(amount, false)} chips</span>
              </TooltipContent>
            </Tooltip>
          ),
        };

      case "raise":
        return {
          action: "raise",
          amount,
          component: (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant={"default"} className="rounded-full bg-blue-100">
                  raise {formatChips(amount)}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <span>{formatChips(amount, false)} chips</span>
              </TooltipContent>
            </Tooltip>
          ),
        };

      default:
        return {
          action: null,
          amount: 0,
          component: null,
        };
    }
  };

  return (
    <div className={cn("flex flex-col items-center space-y-2", className)}>
      {/* Player info header */}
      <div className="flex flex-col items-center gap-y-1.5">
        {/* Action indicator */}
        {currentPlayerIndex ===
          gameState.index_to_action % gameState.players.length && (
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
          <div className="flex gap-1.5">
            <span className="font-extrabold">{team.name}</span>
            {isCurrentPlayerHuman && (
              <Badge variant={"default"} className="rounded-full bg-sky-200">
                human
              </Badge>
            )}
          </div>
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
      <div
        className="flex gap-[clamp(0.15rem,0.3vw,0.375rem)]"
        style={{
          opacity: isCurrentPlayerFolded ? 0.5 : 1,
          transition: "opacity 300ms",
        }}
      >
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
