import { BreadcrumbBuilder } from "@/components/BreadcrumbBuilder";
import { LoaderComponent } from "@/components/LoaderComponent";
import { PokerTable } from "@/components/TableView/PokerTable";
import { useData } from "@/providers/DataProvider";
import { useGameState } from "@/providers/GameStateProvider";

type Props = {
  tableId: string;
};

export function HumanActionsPage({ tableId }: Props) {
  const { data, tablesData } = useData();

  const { gameState } = useGameState();

  const tableName = tablesData?.find((table) => table.id === tableId)?.name;
  const title =
    data?.team?.table?.id === tableId ? `Your Table` : `Table ${tableName}`;

  return (
    <main className="flex flex-col w-full max-w-7xl self-center pb-6">
      <BreadcrumbBuilder
        previousPages={[
          { title: "Home", link: "/" },
          { title: "Admin Panel", link: "/dashboard/admin" },
        ]}
        currentPage={{ title: "Human Actions" }}
      />
      {/* Main content */}
      <section className="flex flex-col mt-6 grow">
        {/* Poker table */}
        {!gameState ? <LoaderComponent /> : <PokerTable />}
      </section>
    </main>
  );
}
