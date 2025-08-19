"use client";

import { useData } from "@/providers/DataProvider";

export function ManageTeams() {
  const { tourneyData, mutate } = useData();
  {
    /* 
    - Form to view and update teams (rename, remove, view code)
    */
  }
  return <section className="flex flex-col gap-3">Manage Teams</section>;
}
