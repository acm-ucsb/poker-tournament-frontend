"use client";

import { ButtonWrapper } from "@/components/ButtonWrapper";
import { useData } from "@/providers/DataProvider";
import Link from "next/link";

export function ViewTables() {
  const { data, tourneyData } = useData();
  return (
    <section className="flex flex-col gap-0.5">
      <h2 className="text-lg font-semibold">View Tables</h2>
      {tourneyData?.status === "not_started" && !!data?.team.table ? (
        <p className="text-sm text-red-300">
          The tournament has not started yet, please wait for tables to be
          created and assigned.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-gray-200">
            The tournament has started. You can watch the action at your table,
            or choose to view other tables.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              className="grow"
              href={`/dashboard/tables/${data?.team.table.id}`}
            >
              <ButtonWrapper className="w-full">Go to your table</ButtonWrapper>
            </Link>
            <Link href={`/dashboard/tables`} className="grow max-w-80">
              <ButtonWrapper className="w-full" variant={"outline"}>
                View other tables
              </ButtonWrapper>
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
