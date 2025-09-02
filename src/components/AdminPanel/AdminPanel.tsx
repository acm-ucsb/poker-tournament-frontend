"use client";

import { BreadcrumbBuilder } from "../BreadcrumbBuilder";
import { ManagePlayers } from "./sections/ManagePlayers";
import { ManageTeams } from "./sections/ManageTeams";
import { ManageTournament } from "./sections/ManageTournament";

export function AdminPanel() {
  return (
    <main className="flex flex-col w-full max-w-7xl self-center pb-6">
      <BreadcrumbBuilder
        previousPages={[{ title: "Home", link: "/" }]}
        currentPage={{ title: "Admin Panel" }}
      />
      {/* Dashboard content */}
      <section className="flex flex-col mt-6">
        <h2 className="text-2xl font-bold mb-2">Admin Panel</h2>
        {/*
        
          What we want to manage in this panel:
            - starting the tournament
              This needs to do the following in order:
                1. Create X number of tables, based on the number of players WITH SUBMITTED CODE
                2. Assign players to tables randomly (the backend fastapi server can decide where to position players?, or should this be stored in DB?)
                3. Start the tournament by setting the status of the tournament to "active"
            - Viewing and updating the teams deadline
            - Viewing and updating the submissions deadline
            - Manage teams (rename, remove, view code)
              - if code is against the rules, disqualify team
            - Manage players (remove)

        */}
        <h3 className="text-lg font-semibold my-3">Manage Tournament</h3>
        <ManageTournament />

        <h3 className="text-lg font-semibold my-3">Manage Teams</h3>
        <ManageTeams />
      </section>
    </main>
  );
}
