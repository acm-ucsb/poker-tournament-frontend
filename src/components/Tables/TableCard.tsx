"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent, CardTitle } from "../ui/card";
import { useData } from "@/providers/DataProvider";
import { Badge } from "../ui/badge";
import { Table } from "@/lib/types";
import { useState } from "react";

type Props = {
  table: Table;
};

export function TableCard({ table }: Props) {
  // Color palette for team circles
  const circleColors = [
    "bg-blue-400",
    "bg-purple-400",
    "bg-pink-400",
    "bg-green-400",
    "bg-yellow-400",
    "bg-red-400",
    "bg-orange-400",
    "bg-teal-400",
    "bg-indigo-400",
    "bg-fuchsia-400",
  ];
  const { data, leaderboardData } = useData();
  const [expanded, setExpanded] = useState(false);

  // Find teams at this table using leaderboardData
  const teamsAtTable = leaderboardData?.filter(
    (team) => team.table_id === table.id
  ) || [];

  // Prevent click on Go To Table button from toggling dropdown
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button, a")) return;
    setExpanded((prev) => !prev);
  };

  return (
    <Card key={table.id} className="p-0">
      <div onClick={handleCardClick} className="cursor-pointer">
        <CardContent className="flex gap-3 justify-between items-center p-2">
          <CardTitle className="flex items-center justify-center gap-2 ml-2">
            {table.name}
            <span className="text-sm text-gray-500">
              {data?.team?.table?.id === table.id && (
                <Badge variant={"success"}>Your Table</Badge>
              )}
            </span>
          </CardTitle>
          <Link
            href={`/dashboard/tables/${table.id}`}
            className="flex items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Button variant={"outline"}>Go To Table</Button>
          </Link>
        </CardContent>
        {/* Dropdown section for teams/chips */}
        {expanded && (
          <div className="px-6 pb-4">
            {teamsAtTable.length === 0 ? (
              <div className="text-xs text-gray-400">No teams at this table.</div>
            ) : (
              <ul className="text-sm">
                {teamsAtTable.map((team, idx) => (
                  <li key={team.id} className="grid grid-cols-[24px_120px_80px] gap-x-3 items-center py-1">
                    <span className={`inline-block w-4 h-4 rounded-full mr-2 ${circleColors[idx % circleColors.length]}`}></span>
                    <span className="truncate text-left w-[120px]">{team.name}</span>
                    <span className="font-mono text-xs text-white w-[80px] flex items-center justify-between">
                      <span>{team.num_chips ?? 0}</span>
                      <img src="/casino-chip.png" alt="chip" className="inline-block w-4 h-4 ml-1" />
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
