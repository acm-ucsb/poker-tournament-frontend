"use client";

import { useData } from "@/providers/DataProvider";
import { BreadcrumbBuilder } from "../BreadcrumbBuilder";
import { ManageTeams } from "./sections/ManageTeams";
import { ManageTournament } from "./sections/ManageTournament";

export function AdminPanel() {
  const { tourneyData } = useData();
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
        <ManageTournament />

        <h3 className="text-lg font-semibold my-3">Manage Teams</h3>
        <ManageTeams />
      </section>
    </main>
  );
}
