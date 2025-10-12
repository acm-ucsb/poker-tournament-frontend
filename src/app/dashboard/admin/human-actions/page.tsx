"use client";

import { HumanActionsPage } from "@/components/AdminPanel/HumanActionsPage/HumanActionsPage";
import { UCSB_HUMAN_POKER_TOURNEY_ID } from "@/lib/constants";
import { createSupabaseClient } from "@/lib/supabase/supabase-client";
import { useData } from "@/providers/DataProvider";
import { GameStateProvider } from "@/providers/GameStateProvider";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  const { data } = useData();
  const supabase = createSupabaseClient();

  useEffect(() => {
    if (!data?.is_admin) {
      // If the user is not an admin, redirect them to the dashboard
      router.replace("/dashboard");
    }
  }, [data?.is_admin]);

  if (!data?.is_admin) {
    return null;
  }

  // fetch the table id for the human bracket
  const { data: humanTable, error } = useQuery(
    supabase
      .from("tables")
      .select("*")
      .eq("tournament_id", UCSB_HUMAN_POKER_TOURNEY_ID)
      .maybeSingle()
  );

  return (
    <GameStateProvider tableId={humanTable?.id ?? ""}>
      <HumanActionsPage tableId={humanTable?.id ?? ""} />
    </GameStateProvider>
  );
}
