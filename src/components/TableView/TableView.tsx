"use client";

import { useState, useEffect } from "react";
import { useData } from "@/providers/DataProvider";
import { BreadcrumbBuilder } from "../BreadcrumbBuilder";
import { PokerTable } from "./PokerTable";
import { PokerGameState } from "@/lib/types";
import { useGameState } from "@/providers/GameStateProvider";

type Props = {
  tableId: string;
};

// Mock data for demonstration
const createMockGameState = (tableId: string): PokerGameState => ({
  tableId,
  phase: "flop",
  pot: 2500,
  communityCards: [
    { suit: "hearts", rank: "A" },
    { suit: "diamonds", rank: "K" },
    { suit: "clubs", rank: "Q" },
    { suit: "diamonds", rank: "Q" },
  ],
  players: [
    {
      id: "1",
      teamId: "team1",
      teamName: "Team Alpha",
      position: 0,
      chips: 15000,
      currentBet: 500,
      cards: [
        { suit: "spades", rank: "A" },
        { suit: "hearts", rank: "K" },
      ],
      status: "active",
      lastAction: "raise",
      lastActionAmount: 500,
      isDealer: false,
      isSmallBlind: false,
      isBigBlind: false,
      isCurrentPlayer: true,
    },
    {
      id: "2",
      teamId: "team2",
      teamName: "Team Beta",
      position: 1,
      chips: 12000,
      currentBet: 0,
      cards: null, // Face down for other players
      status: "folded",
      lastAction: "fold",
      isDealer: false,
      isSmallBlind: false,
      isBigBlind: false,
      isCurrentPlayer: false,
    },
    {
      id: "3",
      teamId: "team3",
      teamName: "Team Gamma",
      position: 2,
      chips: 18000,
      currentBet: 500,
      cards: null,
      status: "active",
      lastAction: "call",
      lastActionAmount: 500,
      isDealer: true,
      isSmallBlind: false,
      isBigBlind: false,
      isCurrentPlayer: false,
    },
    {
      id: "4",
      teamId: "team4",
      teamName: "Team Delta",
      position: 3,
      chips: 8000,
      currentBet: 500,
      cards: null,
      status: "active",
      lastAction: "call",
      lastActionAmount: 500,
      isDealer: false,
      isSmallBlind: true,
      isBigBlind: false,
      isCurrentPlayer: false,
    },
    {
      id: "5",
      teamId: "team5",
      teamName: "Team Epsilon",
      position: 4,
      chips: 22000,
      currentBet: 500,
      cards: null,
      status: "active",
      lastAction: "call",
      lastActionAmount: 500,
      isDealer: false,
      isSmallBlind: false,
      isBigBlind: true,
      isCurrentPlayer: false,
    },
    {
      id: "6",
      teamId: "team5",
      teamName: "Team Epsilon",
      position: 4,
      chips: 22000,
      currentBet: 500,
      cards: null,
      status: "active",
      lastAction: "call",
      lastActionAmount: 500,
      isDealer: false,
      isSmallBlind: false,
      isBigBlind: false,
      isCurrentPlayer: false,
    },
    {
      id: "7",
      teamId: "team5",
      teamName: "Team Epsilon",
      position: 4,
      chips: 22000,
      currentBet: 500,
      cards: null,
      status: "active",
      lastAction: "call",
      lastActionAmount: 500,
      isDealer: false,
      isSmallBlind: false,
      isBigBlind: false,
      isCurrentPlayer: false,
    },
    {
      id: "8",
      teamId: "team5",
      teamName: "Team Epsilon",
      position: 4,
      chips: 22000,
      currentBet: 500,
      cards: null,
      status: "active",
      lastAction: "call",
      lastActionAmount: 500,
      isDealer: false,
      isSmallBlind: false,
      isBigBlind: false,
      isCurrentPlayer: false,
    },
  ],
  currentBet: 500,
  smallBlind: 100,
  bigBlind: 200,
  handNumber: 15,
});

export function TableView({ tableId }: Props) {
  const { data, tablesData } = useData();
  const [gameState, setGameState] = useState<PokerGameState>(() =>
    createMockGameState(tableId)
  );

  const tableName = tablesData?.find((table) => table.id === tableId)?.name;
  const title =
    data?.team?.table?.id === tableId ? `Your Table` : `Table ${tableName}`;

  return (
    <main className="flex flex-col w-full max-w-7xl self-center pb-6">
      <BreadcrumbBuilder
        previousPages={[
          { title: "Home", link: "/" },
          { title: "Dashboard", link: "/dashboard" },
          { title: "Tournament Tables", link: "/dashboard/tables" },
        ]}
        currentPage={{ title: title }}
      />

      {/* Main content */}
      <section className="flex flex-col mt-6">
        {/* Poker table */}
        <PokerTable gameState={gameState} />
      </section>
    </main>
  );
}
