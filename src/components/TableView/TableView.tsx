"use client";

import { useData } from "@/providers/DataProvider";
import { BreadcrumbBuilder } from "../BreadcrumbBuilder";

type Props = {
  tableId: string;
};

export function TableView({ tableId }: Props) {
  const { data, tablesData } = useData();

  const tableName = tablesData?.find((table) => table.id === tableId)?.name;
  const title =
    data?.team?.table?.id === tableId ? `Your Table` : `Table ${tableName}`;

  return (
    <main className="flex flex-col w-full max-w-7xl self-center pb-6">
      <BreadcrumbBuilder
        previousPages={[
          { title: "Home", link: "/" },
          { title: "Dashboard", link: "/dashboard" },
          { title: "Tournament Tables", link: "/dashboard/tables" },
        ]}
        currentPage={{
          title,
        }}
      />
      {/* Dashboard content */}
      <section className="flex flex-col mt-6">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
      </section>
    </main>
  );
}
