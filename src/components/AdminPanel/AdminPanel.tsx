"use client";

import { useData } from "@/providers/DataProvider";
import { BreadcrumbBuilder } from "../BreadcrumbBuilder";
import { ManageTeams, TeamData } from "./sections/ManageTeams";
import { ManageTournament } from "./sections/ManageTournament";
import { createSupabaseClient } from "@/lib/supabase/supabase-client";
import { UCSB_ACTIVE_POKER_TOURNEY_ID } from "@/lib/constants";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";

export function AdminPanel() {
  const supabase = createSupabaseClient();
  const { tourneyData } = useData();

  const {
    data: teams,
    isLoading: isLoadingTeamsData,
    error: fetchTeamsError,
    mutate: mutateTeams,
  } = useQuery<TeamData[]>(
    supabase
      .from("teams")
      .select(
        `
          *,
          table:tables(id),
          owner:users!teams_owner_id_fkey(name),
          members:users!users_team_id_fkey(
            id,
            name,
            email
          )
        `
      )
      .eq("tournament_id", UCSB_ACTIVE_POKER_TOURNEY_ID),
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  return (
    <main className="flex flex-col w-full max-w-7xl self-center pb-6">
      <BreadcrumbBuilder
        previousPages={[{ title: "Home", link: "/" }]}
        currentPage={{ title: "Admin Panel" }}
      />
      {/* Dashboard content */}
      <section className="flex flex-col mt-6">
        <h2 className="text-2xl font-bold mb-2">Admin Panel</h2>
        <h3 className="text-lg font-semibold my-3">
          Manage <span className="underline">{tourneyData?.name}</span>
        </h3>
        <ManageTournament mutateTeams={mutateTeams} />

        <h3 className="text-lg font-semibold my-3">Manage Teams</h3>
        <ManageTeams
          teams={teams || []}
          isLoadingTeamsData={isLoadingTeamsData}
          mutateTeams={mutateTeams}
        />
      </section>
    </main>
  );
}
