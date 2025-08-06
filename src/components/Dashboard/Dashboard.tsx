"use client";

import { BreadcrumbBuilder } from "../BreadcrumbBuilder";
import { ActionSteps } from "../Actions/ActionSteps";
import { useData } from "@/providers/DataProvider";
import { TEAM_MAX_MEMBERS } from "@/lib/constants";
import { StepOne } from "./Steps/StepOne";
import { useAuth } from "@/providers/AuthProvider";
import { StepTwo } from "./Steps/StepTwo";
import { StepThree } from "./Steps/StepThree";

export function Dashboard({}) {
  const auth = useAuth();
  const { data, isLoading, error } = useData();

  return (
    <main className="flex flex-col w-full max-w-7xl self-center">
      <BreadcrumbBuilder
        previousPages={[{ title: "Home", link: "/" }]}
        currentPage={{ title: "Dashboard", link: "/dashboard" }}
      />
      {/* Dashboard content */}
      <section className="flex flex-col mt-6">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <ActionSteps
          loading={isLoading || auth.loadingAuth}
          steps={[
            {
              title: "Create or join a team",
              description: `Make sure all your teammates join the same team. Max ${TEAM_MAX_MEMBERS} members per team.`,
              children: <StepOne />,
              // disabled: !auth.user?.email?.includes("ucsb.edu"), // TODO: re enable User must have a ucsb.edu email
              completed: !!data?.team,
            },
            {
              title: "Submit your bot code",
              description:
                "You must submit your code in order to participate in the tournament.",
              children: <StepTwo />,
              disabled: !data?.team || data?.type === "human", // Disabled if not in a team (step 1)
              completed: !!data?.team?.has_submitted_code,
            },
            {
              title: "Review tournament rules",
              description:
                "Make sure you understand the tournament rules before participating.",
              children: <StepThree />,
              disabled:
                (!data?.team || !data.team.has_submitted_code) &&
                data?.type === "bot", // Disabled if not in a team (step 1) or if bot code is not submitted (step 2)
            },
          ]}
        />
      </section>
    </main>
  );
}
