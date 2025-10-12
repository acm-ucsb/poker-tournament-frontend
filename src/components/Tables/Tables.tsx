import { useData } from "@/providers/DataProvider";
import { BreadcrumbBuilder } from "../BreadcrumbBuilder";
import { TableCard } from "./TableCard";
import { TournamentStats } from "./TournamentStats";

export function Tables() {
  const { data, tablesData } = useData();

  return (
    <main className="flex flex-col w-full max-w-7xl self-center pb-6">
      <BreadcrumbBuilder
        previousPages={[
          { title: "Home", link: "/" },
          { title: "Dashboard", link: "/dashboard" },
        ]}
        currentPage={{ title: "Tournament Menu" }}
      />
      {/* Dashboard content */}
      <section className="flex flex-col mt-6">
        <h2 className="text-2xl font-bold mb-4">Tournament Menu</h2>
        <div className="lg:grid lg:grid-cols-3 flex flex-col gap-3">
          <div className="flex flex-col gap-2 lg:col-span-2 w-full">
            {/* Table for displaying tournament tables */}
            {tablesData
              ?.sort((a, b) => {
                // Sort the tables so that the user's table appears first
                if (a.id === data?.team?.table?.id) return -1;
                if (b.id === data?.team?.table?.id) return 1;

                // Sort the tables so that they appear in the order of their status as such: Active, Paused, Not Started, Inactive
                const statusOrder = {
                  active: 0,
                  paused: 1,
                  not_started: 2,
                  inactive: 3,
                };
                if (statusOrder[a.status] < statusOrder[b.status]) return -1;
                if (statusOrder[a.status] > statusOrder[b.status]) return 1;

                return a.name.localeCompare(b.name);
              })
              .map((table) => (
                <TableCard key={table.id} table={table} />
              ))}
          </div>

          <div className="lg:col-span-1 lg:ml-6">
            {/* Table for displaying tournament statistics */}
            <div className="w-full h-full grow">
              <TournamentStats />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
