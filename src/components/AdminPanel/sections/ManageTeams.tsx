"use client";

import { TeamCard } from "@/components/Teams/TeamCard";
import { Skeleton } from "@/components/ui/skeleton";
import { createSupabaseClient } from "@/lib/supabase/supabase-client";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";

export type TeamData = Team & {
  table: { id: string } | null;
  owner: { name: string } | null;
  members: { id: string; name: string; email: string }[];
};

export function ManageTeams() {
  const supabase = createSupabaseClient();

  const {
    data: teams,
    isLoading: isLoadingTeamsData,
    error: fetchTeamsError,
    mutate: mutateTeams,
  } = useQuery<TeamData[]>(
    supabase.from("teams").select(`
      *,
      table:tables(id),
      owner:users!teams_owner_id_fkey(name),
      members:users!users_team_id_fkey(
        id,
        name,
        email
      )
    `),
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

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
