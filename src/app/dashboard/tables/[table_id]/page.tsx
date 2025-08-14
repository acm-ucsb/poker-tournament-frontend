"use client";

import { TableView } from "@/components/TableView/TableView";
import { useData } from "@/providers/DataProvider";
import { Loader2 } from "lucide-react";
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
    return (
      <div className="flex items-center justify-center grow">
        <Loader2 className="animate-spin text-green-300" size={40} />
      </div>
    );
  }

  return <TableView tableId={tableId} />;
}
