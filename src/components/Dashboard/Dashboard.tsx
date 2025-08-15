"use client";

import { BreadcrumbBuilder } from "../BreadcrumbBuilder";
import { ActionSteps } from "@/components/Actions/ActionSteps";
import { useData } from "@/providers/DataProvider";
import { TEAM_MAX_MEMBERS } from "@/lib/constants";
import { ManageTeam } from "@/components/Dashboard/Steps/ManageTeam";
import { useAuth } from "@/providers/AuthProvider";
import { SubmitCode } from "@/components/Dashboard/Steps/SubmitCode";
import { ReviewRules } from "@/components/Dashboard/Steps/ReviewRules";
import { ViewTables } from "./Steps/ViewTables";
import { useLocalStorage } from "@mantine/hooks";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoaderComponent } from "../LoaderComponent";

export function Dashboard({}) {
  const auth = useAuth();
  const { data, tourneyData, isLoading } = useData();
  const router = useRouter();

  const [hasAcknowledgedRules] = useLocalStorage({
    key: "ack-tournament-rules",
    defaultValue: false,
    deserialize: (value) => value === "true",
    serialize: (value) => (value ? "true" : "false"),
  });

  useEffect(() => {
    // if is_admin, redirect to admin panel
    if (data?.is_admin) {
      router.replace("/dashboard/admin");
    }
  }, [data?.is_admin]);

  if (data?.is_admin) {
    return <LoaderComponent />;
  }

  return (
    <main className="flex flex-col w-full max-w-7xl self-center pb-6">
      <BreadcrumbBuilder
        previousPages={[{ title: "Home", link: "/" }]}
        currentPage={{ title: "Dashboard", link: "/dashboard" }}
      />
      {/* Dashboard content */}
      <section className="flex flex-col mt-6">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        {!data?.is_admin && (
          <ActionSteps
            loading={isLoading || auth.loadingAuth}
            steps={[
              {
                title: "Review tournament rules",
                description:
                  "Please review our tournament rules before participating.",
                children: <ReviewRules />,
                disabled: !auth.user?.email?.includes("ucsb.edu"), // User must have a ucsb.edu email
                completed: hasAcknowledgedRules, // Completed if rules are acknowledged
              },
              {
                title: "Create or join a team",
                description: `Make sure all your teammates join the same team. Max ${TEAM_MAX_MEMBERS} members per team.`,
                children: <ManageTeam />,
                disabled: !hasAcknowledgedRules, // Disabled until rules are acknowledged
                completed: !!data?.team,
              },
              {
                title: "Submit your bot code",
                description:
                  "You must submit your code in order to participate in the tournament.",
                children: <SubmitCode />,
                disabled: !data?.team || data?.type === "human", // Disabled if not in a team (step 1)
                completed: !!data?.team?.has_submitted_code,
              },
              {
                title: "View tournament tables",
                description:
                  "Join your assigned table or spectate other games in the tournament.",
                children: <ViewTables />,
                disabled: !data?.team || !data.team.has_submitted_code,
                completed:
                  !!data?.team?.table && tourneyData?.status !== "not_started",
                incomplete:
                  tourneyData?.status !== "not_started" &&
                  !data?.team?.table &&
                  data?.team?.has_submitted_code,
              },
            ]}
          />
        )}
      </section>
    </main>
  );
}
