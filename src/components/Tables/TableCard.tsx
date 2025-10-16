"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent, CardTitle } from "../ui/card";
import { useData } from "@/providers/DataProvider";
import { Badge } from "../ui/badge";
import { Table } from "@/lib/types";
import { UCSB_HUMAN_POKER_TOURNEY_ID } from "@/lib/constants";

type Props = {
  table: Table;
};

export function TableCard({ table }: Props) {
  const { data } = useData();
  return (
    <Card key={table.id} className="p-0">
      <CardContent className="flex gap-3 justify-between items-center p-2">
        <CardTitle className="flex items-center justify-center gap-2 ml-2">
          {table.name}
          <div className="hidden sm:flex gap-2">
            {data?.team?.table?.id === table.id && (
              <Badge variant={"success"}>Your Table</Badge>
            )}
            {table.status === "active" && (
              <Badge variant={"success"}>Active</Badge>
            )}
            {table.status === "inactive" && (
              <Badge variant={"error"}>Inactive</Badge>
            )}
            {table.status === "paused" && (
              <Badge variant={"warning"}>Paused</Badge>
            )}
            {table.status === "not_started" && (
              <Badge variant={"warning"}>Not Started</Badge>
            )}
            {table.tournament_id === UCSB_HUMAN_POKER_TOURNEY_ID && (
              <Badge variant={"info"}>Human Bracket</Badge>
            )}
            <Badge variant={"info"}>
              {table.game_state.players.length} Player
              {table.game_state.players.length !== 1 ? "s" : ""}
            </Badge>
          </div>
        </CardTitle>
        <Link
          href={`/dashboard/tables/${table.id}`}
          className="flex items-center"
        >
          <Button variant={"outline"}>Go To Table</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
