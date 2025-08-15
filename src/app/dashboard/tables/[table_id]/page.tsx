"use client";

import { LoaderComponent } from "@/components/LoaderComponent";
import { TableView } from "@/components/TableView/TableView";
import { useData } from "@/providers/DataProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page({
  params,
}: {
  params: Promise<{ table_id: string }>;
}) {
  const { tourneyData } = useData();
  const router = useRouter();
  const [tableId, setTableId] = useState<string>("");

  useEffect(() => {
    if (tourneyData?.status === "not_started") {
      router.replace("/dashboard");
      toast.error("This tournament has not started yet.", {
        richColors: true,
      });
    }

    params.then((p) => {
      setTableId(p.table_id);
    });
  }, [tourneyData?.status]);

  if (tourneyData?.status === "not_started") {
    return <LoaderComponent />;
  }

  return <TableView tableId={tableId} />;
}
