"use client";

import { ButtonWrapper } from "@/components/ButtonWrapper";
import { useData } from "@/providers/DataProvider";
import Link from "next/link";

export function ViewTables() {
  return (
    <section className="flex flex-col gap-0.5">
      <h2 className="text-lg font-semibold">View Tables</h2>
      <DisplayViewTables />
    </section>
  );
}

function DisplayViewTables() {
  const { data, tourneyData } = useData();
  const isHuman = data?.type === "human" || data?.team?.type === "human";

  if (!tourneyData || tourneyData.status === "not_started") {
    return (
      <p className="text-sm text-red-300">
        The tournament has not started yet. Tables will be available once the
        tournament begins.
      </p>
    );
  }

  if (!!data?.team && !data?.team?.table && !isHuman) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-red-300">
          The tournament has started, but you have not been assigned a table
          yet. Please wait for your seat to be assigned or contact us if you
          believe this is an error.
        </p>
        <Link href={`/dashboard/tables`} className="grow">
          <ButtonWrapper className="w-full" variant={"default"}>
            View other tables
          </ButtonWrapper>
        </Link>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-gray-200">
          The tournament has started. You can watch the action at any table.
        </p>
        <div className="flex flex-wrap gap-2">
          {data?.team?.table && (
            <Link
              className="grow"
              href={`/dashboard/tables/${data?.team?.table.id}`}
            >
              <ButtonWrapper className="w-full">Go to your table</ButtonWrapper>
            </Link>
          )}
          <Link href={`/dashboard/tables`} className="grow">
            <ButtonWrapper className="w-full" variant={"outline"}>
              View all tables
            </ButtonWrapper>
          </Link>
        </div>
      </div>
    );
  }
}
