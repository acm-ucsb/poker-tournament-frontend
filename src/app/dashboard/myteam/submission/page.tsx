"use client";

import { LoaderComponent } from "@/components/LoaderComponent";
import { SubmissionPage } from "@/components/Submission/Submission";
import { useAuth } from "@/providers/AuthProvider";
import { useData } from "@/providers/DataProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Submission() {
  const auth = useAuth();
  const { data } = useData();
  const router = useRouter();

  // If the user is not in a team, redirect to dashboard
  useEffect(() => {
    if (!auth.user) {
      return;
    }
    if (!data?.team) {
      router.replace("/dashboard");
      toast.error(
        "You are not in a team. You must create or join a team before accessing this page.",
        {
          richColors: true,
        }
      );
    }
  }, []);

  if (!data?.team) {
    return <LoaderComponent />;
  }

  return <SubmissionPage />;
}
