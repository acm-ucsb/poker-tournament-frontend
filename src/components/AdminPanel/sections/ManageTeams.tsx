"use client";

import { TeamCard } from "@/components/Teams/TeamCard";
import { Skeleton } from "@/components/ui/skeleton";
import { UCSB_ACTIVE_POKER_TOURNEY_ID } from "@/lib/constants";
import { createSupabaseClient } from "@/lib/supabase/supabase-client";
import { Team } from "@/lib/types";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";

export type TeamData = Team & {
  table: { id: string } | null;
  owner: { name: string } | null;
  members: { id: string; name: string; email: string }[];
};

type Props = {
  teams: TeamData[];
  isLoadingTeamsData: boolean;
  mutateTeams: () => void;
};

export function ManageTeams({ teams, isLoadingTeamsData, mutateTeams }: Props) {
  return (
    <section className="flex flex-col gap-3">
      <div className="grid grid-cols-1 w-full justify-between items-center gap-2 auto-rows-fr">
        {isLoadingTeamsData ? (
          <>
            <Skeleton className="h-16 rounded-2xl" />
            <Skeleton className="h-16 rounded-2xl" />
          </>
        ) : (
          teams
            ?.sort((a, b) => {
              if (a.has_submitted_code && !b.has_submitted_code) return -1;
              if (!a.has_submitted_code && b.has_submitted_code) return 1;
              if (a.created_at > b.created_at) return -1;
              if (a.created_at < b.created_at) return 1;
              return a.name.localeCompare(b.name);
            })
            .map((team) => (
              <TeamCard key={team.id} team={team} mutate={mutateTeams} />
            ))
        )}
      </div>
    </section>
  );
}
