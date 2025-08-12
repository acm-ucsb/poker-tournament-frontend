"use client";

import { Session } from "@supabase/supabase-js";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/supabase-client";
import { toast } from "sonner";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { useAuth } from "./AuthProvider";
import { Loader2 } from "lucide-react";
import { UCSB_POKER_TOURNEY_ID } from "@/lib/constants";
import { useLocalStorage } from "@mantine/hooks";

type UserData = User & {
  team: Team & {
    table: Table;
    owner: User;
  };
};

type TeamData = {
  id: string;
  name: string;
  members: User[];
};

type DataContextType = {
  data: UserData | null;
  teamData: TeamData | null;
  tourneyData: Tournament | null;
  isLoading: boolean;
  error: string | null;
  mutate: () => void;
};

const DataContext = createContext<DataContextType>({
  data: null,
  teamData: null,
  tourneyData: null,
  isLoading: false,
  error: null,
  mutate: () => {},
});

type DataProviderProps = {
  children: ReactNode;
};

export function DataProvider({ children }: DataProviderProps) {
  const auth = useAuth();
  const supabase = createSupabaseClient();

  const {
    data: fetchedData,
    isLoading: isLoadingUserData,
    error: fetchError,
    mutate: mutateUser,
  } = useQuery<UserData>(
    auth.user
      ? supabase
          .from("users")
          .select(
            `
              *,
              team:teams!users_team_id_fkey (
                id,
                created_at,
                has_submitted_code,
                num_chips,
                name,
                table:tables (
                  id,
                  created_at,
                  status
                ),
                owner:users!teams_owner_id_fkey (
                  *
                )
              )
            `
          )
          .eq("id", auth.user?.id)
          .maybeSingle()
      : null,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  const {
    data: fetchedTeamData,
    isLoading: isLoadingTeamData,
    error: fetchTeamError,
    mutate: mutateTeam,
  } = useQuery<TeamData>(
    auth.user && fetchedData?.team
      ? supabase
          .from("teams")
          .select(
            `
              id,
              name,
              members:users!users_team_id_fkey(
                *
              )
            `
          )
          .eq("id", fetchedData?.team?.id)
          .maybeSingle()
      : null,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  const {
    data: fetchedTourneyData,
    isLoading: isLoadingTourneyData,
    error: fetchTourneyError,
    mutate: mutateTourney,
  } = useQuery<Tournament>(
    auth.user
      ? supabase
          .from("tournaments")
          .select("*")
          .eq("id", UCSB_POKER_TOURNEY_ID)
          .maybeSingle()
      : null,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  const data = fetchedData ?? null;
  const error = fetchError?.message ?? null;

  const teamData = fetchedTeamData ?? null;
  const teamError = fetchTeamError?.message ?? null;

  const tourneyData = fetchedTourneyData ?? null;
  const tourneyError = fetchTourneyError?.message ?? null;

  // store session, user, updateUserSession, and signOut function in context
  const value = useMemo(
    () => ({
      data,
      teamData,
      tourneyData,
      isLoading: isLoadingUserData || isLoadingTeamData || isLoadingTourneyData,
      error: error || teamError || tourneyError,
      mutate: () => {
        mutateUser();
        mutateTeam();
        mutateTourney();
      },
    }),
    [
      data,
      teamData,
      tourneyData,
      isLoadingUserData,
      isLoadingTeamData,
      isLoadingTourneyData,
      error,
      teamError,
      tourneyError,
      mutateUser,
      mutateTeam,
      mutateTourney,
    ]
  );

  // if user is not on a team, set to false
  const [hasAcknowledgedRules, setHasAcknowledgedRules] = useLocalStorage({
    key: "ack-tournament-rules",
    defaultValue: false,
    deserialize: (value) => value === "true",
    serialize: (value) => (value ? "true" : "false"),
  });

  useEffect(() => {
    if (!data?.team && hasAcknowledgedRules) {
      setHasAcknowledgedRules(false);
    }
  }, [data?.team, hasAcknowledgedRules, setHasAcknowledgedRules]);

  return (
    <DataContext.Provider value={value}>
      {/* Only show loader if not on home page and no data is available */}
      {auth.user && (!data || !tourneyData) ? (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="animate-spin text-green-300" size={40} />
        </div>
      ) : (
        children
      )}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
