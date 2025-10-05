"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent, CardTitle } from "../ui/card";
import { useData } from "@/providers/DataProvider";
import { Badge } from "../ui/badge";
import { Table } from "@/lib/types";

type Props = {
  table: Table;
};

export function TableCard({ table }: Props) {
  const { data } = useData();
  return (
    <Card key={table.id} className="p-0">
      <CardContent className="flex gap-3 justify-between items-center p-2">
        <CardTitle className="flex items-center justify-center gap-2 ml-2">
          {table.name}
          <span className="text-sm text-gray-500">
            {data?.team?.table?.id === table.id && (
              <Badge variant={"success"}>Your Table</Badge>
            )}
          </span>
        </CardTitle>
        <Link
          href={`/dashboard/tables/${table.id}`}
          className="flex items-center"
        >
          <Button variant={"outline"}>Go To Table</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
