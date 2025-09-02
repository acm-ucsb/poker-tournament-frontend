"use client";

import { AdminSubmissionPage } from "@/components/Submission/AdminSubmissionPage";
import { useData } from "@/providers/DataProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ team_id: string }>;
}) {
  const router = useRouter();
  const { data } = useData();

  useEffect(() => {
    if (!data?.is_admin) {
      // If the user is not an admin, redirect them to the dashboard
      router.replace("/dashboard");
    }
  }, [data?.is_admin]);

  if (!data?.is_admin) {
    return null;
  }

  return <AdminSubmissionPage params={params} />;
}
