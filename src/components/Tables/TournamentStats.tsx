"use client";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { User as UserIcon } from "lucide-react";
import { createSupabaseClient } from "@/lib/supabase/supabase-client";
import Link from "next/link";
import { useData } from "@/providers/DataProvider";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { Skeleton } from "../ui/skeleton";

export function TournamentStats() {
  const { tourneyData, tablesData } = useData();
  const supabase = createSupabaseClient();

  const { count: remainingPlayers, isLoading } = useQuery(
    supabase
      .from("teams")
      .select("*", { count: "exact", head: true })
      .eq("tournament_id", tourneyData?.id)
      .neq("num_chips", 0),
    {
      refreshInterval: 1000,
    }
  );

  return (
    <div className="flex-[1] min-w-0">
      <div className="grid gap-4">
        {/* Main tournament header/detail box */}
        <TournamentDetails />

        {/* Small stat boxes in a responsive grid to match table cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {isLoading ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <StatBox
              label="Remaining Teams"
              value={remainingPlayers || "N/A"}
              icon={<UserIcon className="w-6 h-6 text-gray-300" />}
            />
          )}
          <StatBox
            label="Blind"
            value={`${tablesData?.[0].game_state.small_blind} / ${tablesData?.[0].game_state.big_blind}`}
            icon={
              <img
                src={encodeURI("/Poker Chip Single.png")}
                alt="chip"
                className="w-6 h-6"
              />
            }
          />
          <StatBox
            label="Starting Chips"
            value={tourneyData?.starting_chips.toLocaleString() || "N/A"}
            icon={<img src="/casino-chip.png" alt="chip" className="w-6 h-6" />}
          />
          <StatBox
            label="Active Tables"
            value={
              tablesData?.filter((table) => table.status === "active").length ||
              "N/A"
            }
            icon={
              <img
                src={encodeURI("/poker-table (1).png")}
                alt="table"
                className="w-8 h-8"
              />
            }
          />
        </div>

        {/* Leaderboard and Live Feed as full-width boxes below the small stats */}
        <div className="grid grid-cols-1 gap-3">
          <LeaderboardTracker />
        </div>
      </div>
    </div>
  );
}

// Shared card wrapper class to keep a consistent, clean aesthetic
const cardBase =
  "w-full rounded-xl p-4 bg-[var(--card)] text-[var(--card-foreground)] backdrop-blur-sm";

export function LiveFeed() {
  // Stub list of live actions (replace with websocket data in future)
  const actions = [
    {
      id: 1,
      type: "win",
      player: "Alice",
      amount: 1200,
      table: "Table 2",
      description: "Won a high pot",
    },
    {
      id: 2,
      type: "loss",
      player: "Bob",
      amount: 800,
      table: "Table 1",
      description: "Lost a big hand",
    },
    {
      id: 3,
      type: "all-in",
      player: "Charlie",
      amount: 1500,
      table: "Table 3",
      description: "Went all-in",
    },
    {
      id: 4,
      type: "win",
      player: "Dana",
      amount: 900,
      table: "Table 4",
      description: "Won with a flush",
    },
    {
      id: 5,
      type: "loss",
      player: "Eve",
      amount: 500,
      table: "Table 5",
      description: "Busted out",
    },
  ];

  const typeColor = (t: string) =>
    t === "win"
      ? "text-[#60ef86]"
      : t === "loss"
        ? "text-[#ef6060]"
        : "text-[#f5c542]";

  return (
    <div className={`${cardBase} space-y-3`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold tracking-wide">Live Feed</h3>
        <span className="text-sm text-gray-400">real-time highlights</span>
      </div>

      <ul className="space-y-2 max-h-72 overflow-y-auto pr-2">
        {actions.map((a) => (
          <li
            key={a.id}
            className="flex items-start gap-3 p-3 rounded-lg border border-transparent hover:bg-[rgba(96,239,134,0.06)] hover:border-[rgba(96,239,134,0.06)] transition-colors"
          >
            <div className={`flex-shrink-0 mt-0.5 ${typeColor(a.type)}`}>
              {a.type === "win" ? "🏆" : a.type === "loss" ? "💔" : "🔥"}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium truncate">{a.player}</span>
                <span className="text-xs text-gray-400">• {a.table}</span>
                <span className="ml-auto font-mono font-semibold text-sm text-gray-100">
                  {a.amount.toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-gray-300 truncate mt-1">
                {a.description}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const formatDate = (timestamp: string | null | undefined) => {
  if (!timestamp) return null;
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export function TournamentDetails() {
  const { tourneyData } = useData();
  // Stub tournament details (replace with API data in future)
  const tournament = {
    name: tourneyData?.name,
    startTime: formatDate(tourneyData?.start_time),
    endTime: formatDate(tourneyData?.end_time),
    status:
      tourneyData?.status == "active"
        ? "In Progress"
        : tourneyData?.status == "completed"
          ? "Ended"
          : "Will Begin",
  };

  const statusClass =
    tournament.status === "In Progress"
      ? "text-[#60ef86] font-semibold"
      : tournament.status === "Ended" || tournament.status === "Will Begin"
        ? "text-[#ef6060] font-semibold"
        : "text-gray-400";

  return (
    <div className={cardBase}>
      <div className="flex items-start gap-4">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold">{tournament.name}</h2>
          <p className="text-sm mt-1 truncate">
            <span className={statusClass}>{tournament.status}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4 text-sm text-gray-300 min-w-0">
        <div className="min-w-0">
          <div className="text-xs text-gray-400">Start</div>
          <div className="font-medium text-white truncate">
            {tournament.startTime}
          </div>
        </div>
        <div className="min-w-0">
          <div className="text-xs text-gray-400">End</div>
          <div className="font-medium text-white truncate">
            {tournament.endTime}
          </div>
        </div>
      </div>
    </div>
  );
}

export function LeaderboardTracker() {
  const { leaderboardData } = useData();

  const teams = leaderboardData || [];

  return (
    <div className={cardBase}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Leaderboard</h3>
      </div>
      <div className="mt-3">
        {/* Height for 5 items: 5 * 3.5rem (item height + padding) + 4 * 0.5rem (space-y-2) = 19.5rem */}
        <ol className={`space-y-2 pr-2 h-[19.5rem] overflow-y-auto`}>
          {teams
            .sort((a, b) => {
              // sort by chips, then by name
              if (b.num_chips !== a.num_chips) {
                return b.num_chips - a.num_chips;
              }
              return a.name.localeCompare(b.name);
            })
            .map((team, i) => (
              <Link
                key={team.id}
                href={
                  team.table_id ? `/dashboard/tables/${team.table_id}` : "#"
                }
                title={
                  team.table_id
                    ? `Go to table ${team.table_id}`
                    : "No table assigned"
                }
              >
                <li className="flex items-center gap-3 p-3 rounded-lg border border-transparent hover:bg-[var(--secondary)] transition-colors cursor-pointer">
                  <div
                    className={`flex items-center justify-center w-9 h-9 rounded-full font-bold ${i === 0 ? "bg-yellow-400 text-yellow-900" : i === 1 ? "bg-gray-300 text-gray-800" : i === 2 ? "bg-orange-400 text-orange-900" : "bg-gray-700 text-white"}`}
                  >
                    {i + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="text-base font-medium truncate">
                      {team.name}
                    </div>
                  </div>
                  <div className="ml-auto font-mono font-semibold text-sm flex items-center gap-2">
                    {team.num_chips.toLocaleString()}
                    <img
                      src="/casino-chip.png"
                      alt="chip"
                      className="w-4 h-4 inline-block"
                    />
                  </div>
                </li>
              </Link>
            ))}
        </ol>
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon?: ReactNode;
}) {
  return (
    <div className={`${cardBase} p-4`}>
      <div className="grid grid-rows-2 grid-cols-[1fr_auto] gap-0.5 items-start">
        <div className="row-start-1 min-w-0">
          <div className="text-xs text-gray-400 uppercase tracking-wider">
            {label}
          </div>
        </div>

        <div className="row-start-2 min-w-0">
          <div className="text-lg font-semibold truncate">{value}</div>
        </div>

        {icon && (
          <div className="row-start-2 self-center flex-shrink-0 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
