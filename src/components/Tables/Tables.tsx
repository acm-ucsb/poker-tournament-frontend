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
        currentPage={{ title: "Tournament Tables" }}
      />
      {/* Dashboard content */}
      <section className="flex flex-col mt-6">
        <h2 className="text-2xl font-bold mb-4">Tournament Tables</h2>
        <div className="md:grid md:grid-cols-3 flex flex-col-reverse gap-3">
          <div className="flex flex-col gap-2 md:col-span-2 w-full">
            <h3 className="text-lg font-semibold mb-1">Tables</h3>
            {/* Table for displaying tournament tables */}
            {tablesData
              ?.sort((a, b) => {
                if (a.id === data?.team?.table?.id) return -1;
                if (b.id === data?.team?.table?.id) return 1;
                return a.name.localeCompare(b.name);
              })
              .map((table) => (
                <TableCard key={table.id} table={table} />
              ))}
          </div>

          <div className="md:col-span-1">
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
