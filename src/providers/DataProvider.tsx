"use client";

import { Session, User } from "@supabase/supabase-js";
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

type TableStatus = "not_started" | "active" | "waiting" | "inactive";
type UserType = "bot" | "human";

type Data = {
  id: string;
  created_at: string;
  name: string;
  is_admin: boolean;
  type: UserType;
  team: {
    id: string;
    created_at: string;
    has_submitted_code: boolean;
    num_chips: number;
    name: string;
    table: {
      id: string;
      created_at: string;
      status: TableStatus;
    };
    owner: {
      id: string;
      created_at: string;
      name: string;
      is_admin: boolean;
      type: UserType;
    };
  };
};

type DataContextType = {
  data: Data | null;
  isLoading: boolean;
  error: string | null;
  mutate: () => void;
};

const DataContext = createContext<DataContextType>({
  data: null,
  isLoading: false,
  error: null,
  mutate: () => {},
});

type DataProviderProps = {
  children: ReactNode;
};

export function DataProvider({ children }: DataProviderProps) {
  const supabase = createSupabaseClient();

  const {
    data: fetchedData,
    isLoading,
    error: fetchError,
    mutate,
  } = useQuery<Data>(
    supabase
      .from("users")
      .select(
        `
        id,
        created_at,
        name,
        is_admin,
        type,
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
          owner:users!teams_team_owner_id_fkey (
            id,
            created_at,
            name,
            is_admin,
            type
          )
        )
      `
      )
      .single(),
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  const data = fetchedData ?? null;
  const error = fetchError?.message ?? null;

  // store session, user, updateUserSession, and signOut function in context
  const value = useMemo(
    () => ({
      data,
      isLoading,
      error,
      mutate,
    }),
    [data, isLoading, error, mutate]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
