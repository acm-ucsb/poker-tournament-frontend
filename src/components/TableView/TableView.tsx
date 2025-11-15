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
  findPlayerChanges,
} from "@/lib/util/gameStateUtil";
import { getBestHandDescription } from "@/lib/util/pokerHandEvaluator";
import { unparseCard } from "@/lib/util/parseGameState";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const table = tablesData?.find((table) => table.id === tableId);
  const tableName = table?.name;
  const title =
    data?.team?.table?.id === tableId ? `Your Table` : `Table ${tableName}`;

  // Redirect if table not found, or table has been closed
  useEffect(() => {
    if (!data || !tablesData || !table) {
      toast.info("Table not found, or the table has been closed.", {
        richColors: true,
      });

      router.replace("/dashboard/tables");
    }
  }, [table]);

  // Notifications for game updates (hand winner, table joined, etc.)
  // TODO: implement player joined notification
  useEffect(() => {
    if (!gameState) return;

    // Update notifications for game updates
    if (laggedGameState && laggedGameState !== gameState) {
      // Show notification for hand winner
      const winners = findHandWinners(laggedGameState, gameState);

      if (winners.length > 0) {
        // Display toast notification for each winner
        winners.forEach((winner) => {
          try {
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
              duration: 10000,
            });
          } catch (error) {
            console.log("Error generating winning hand description:", error);
          }
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
              duration: 10000,
            }
          );
        });
      }

      // Show notification for players who joined or left the table
      // Pass eliminatedPlayers to avoid duplicate notifications for eliminated players
      const playerChanges = findPlayerChanges(
        laggedGameState,
        gameState,
        eliminatedPlayers
      );

      if (playerChanges.length > 0) {
        playerChanges.forEach((change) => {
          if (change.changeType === "joined") {
            toast.info(`${change.playerName} joined the table!`, {
              richColors: true,
              duration: 10000,
            });
          } else {
            toast.warning(`${change.playerName} left the table!`, {
              richColors: true,
              duration: 10000,
            });
          }
        });
      }
    }

    setLaggedGameState(gameState);
  }, [gameState]);

  if (!data || !tablesData || !table) {
    return <LoaderComponent />;
  }

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
