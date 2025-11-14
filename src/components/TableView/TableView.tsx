"use client";

import { useState, useEffect } from "react";
import { useData } from "@/providers/DataProvider";
import { BreadcrumbBuilder } from "../BreadcrumbBuilder";
import { PokerTable } from "./PokerTable";
import { PokerGameState } from "@/lib/types";
import { useGameState } from "@/providers/GameStateProvider";
import { LoaderComponent } from "../LoaderComponent";
import { toast } from "sonner";
import { formatChips } from "@/lib/util/util";
import {
  findHandWinners,
  findEliminatedPlayers,
} from "@/lib/util/gameStateUtil";
import { getBestHandDescription } from "@/lib/util/pokerHandEvaluator";
import { unparseCard } from "@/lib/util/parseGameState";

type Props = {
  tableId: string;
};

export function TableView({ tableId }: Props) {
  const { data, tablesData } = useData();
  const { gameState } = useGameState();
  // Game state, lagged 1 update
  const [laggedGameState, setLaggedGameState] = useState<PokerGameState | null>(
    null
  );

  const tableName = tablesData?.find((table) => table.id === tableId)?.name;
  const title =
    data?.team?.table?.id === tableId ? `Your Table` : `Table ${tableName}`;

  // Notifications for game updates (hand winner, table joined, etc.)
  useEffect(() => {
    if (!gameState) return;

    // Update notifications for game updates
    if (laggedGameState && laggedGameState !== gameState) {
      // Show notification for hand winner
      const winners = findHandWinners(laggedGameState, gameState);

      if (winners.length > 0) {
        // Display toast notification for each winner
        winners.forEach((winner) => {
          const playerCards = laggedGameState.players_cards[
            winner.playerIndex
          ].map((c) => unparseCard(c));
          const communityCards = laggedGameState.community_cards.map((c) =>
            unparseCard(c)
          );
          const winningHand = getBestHandDescription(
            playerCards,
            communityCards
          );

          const message =
            winners.length > 1
              ? `${winner.playerName} won ${formatChips(winner.chipsWon, false)} chips (split pot) with ${winningHand}!`
              : `${winner.playerName} won ${formatChips(winner.chipsWon, false)} chips with ${winningHand}!`;

          toast.success(message, {
            richColors: true,
            duration: 5000,
          });
        });
      }

      // Show notification for eliminated players (0 chips left, and not in any pots)
      const eliminatedPlayers = findEliminatedPlayers(
        laggedGameState,
        gameState
      );

      if (eliminatedPlayers.length > 0) {
        eliminatedPlayers.forEach((player) => {
          toast.error(
            `${player.playerName} has been eliminated from the table!`,
            {
              richColors: true,
              duration: 7000,
            }
          );
        });
      }
    }

    setLaggedGameState(gameState);
  }, [gameState]);

  return (
    <main className="flex flex-col w-full max-w-7xl self-center pb-6 grow">
      <BreadcrumbBuilder
        previousPages={[
          { title: "Home", link: "/" },
          { title: "Dashboard", link: "/dashboard" },
          { title: "Tournament Tables", link: "/dashboard/tables" },
        ]}
        currentPage={{ title: title }}
      />

      {/* Main content */}
      <section className="flex flex-col mt-6 grow">
        {/* Poker table */}
        {!gameState ? <LoaderComponent /> : <PokerTable />}
      </section>
    </main>
  );
}
