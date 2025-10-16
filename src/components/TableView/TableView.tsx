"use client";

import { useState, useEffect } from "react";
import { useData } from "@/providers/DataProvider";
import { BreadcrumbBuilder } from "../BreadcrumbBuilder";
import { PokerTable } from "./PokerTable";
import { PokerGameState } from "@/lib/types";
import { useGameState } from "@/providers/GameStateProvider";
import { LoaderComponent } from "../LoaderComponent";

type Props = {
  tableId: string;
};

export function TableView({ tableId }: Props) {
  const { data, tablesData } = useData();
  const { gameState } = useGameState();

  const tableName = tablesData?.find((table) => table.id === tableId)?.name;
  const title =
    data?.team?.table?.id === tableId ? `Your Table` : `Table ${tableName}`;

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
