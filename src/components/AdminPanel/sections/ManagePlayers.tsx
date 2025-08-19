"use client";

import { useData } from "@/providers/DataProvider";

export function ManagePlayers() {
  const { tourneyData, mutate } = useData();
  {
    /* 
    - Form to view and update players (remove)
    */
  }
  return <section className="flex flex-col gap-3">Manage Players</section>;
}
