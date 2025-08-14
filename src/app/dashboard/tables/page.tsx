"use client";

import { Tables } from "@/components/Tables/Tables";
import { useData } from "@/providers/DataProvider";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function TablesPage() {
  const { tourneyData } = useData();
  const router = useRouter();

  useEffect(() => {
    if (tourneyData?.status === "not_started") {
      router.replace("/dashboard");
      toast.error("This tournament has not started yet.", {
        richColors: true,
      });
    }
  }, [tourneyData?.status]);

  if (tourneyData?.status === "not_started") {
    return (
      <div className="flex items-center justify-center grow">
        <Loader2 className="animate-spin text-green-300" size={40} />
      </div>
    );
  }

  return <Tables />;
}
