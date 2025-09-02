"use client";

import { LoaderComponent } from "@/components/LoaderComponent";
import { Tables } from "@/components/Tables/Tables";
import { useData } from "@/providers/DataProvider";
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
    return <LoaderComponent />;
  }

  return <Tables />;
}
