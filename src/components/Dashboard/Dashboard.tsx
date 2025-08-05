"use client";

import { BreadcrumbBuilder } from "../BreadcrumbBuilder";
import { ActionSteps } from "../Actions/ActionSteps";
import { useData } from "@/providers/DataProvider";
import { TEAM_MAX_MEMBERS } from "@/lib/constants";
import { StepOne } from "./Steps/StepOne";

export function Dashboard({}) {
  const { data, isLoading, error } = useData();

  return (
    <main className="flex flex-col w-full max-w-7xl self-center">
      <BreadcrumbBuilder
        previousPages={[{ title: "Home", link: "/" }]}
        currentPage={{ title: "Dashboard", link: "/dashboard" }}
      />
      {/* Dashboard content */}
      <section className="flex flex-col mt-6">
        <h1 className="flex items-center gap-1.5 text-2xl font-bold mb-4">
          Dashboard
        </h1>
        <ActionSteps
          steps={[
            {
              order: 1,
              title: "Create or join a team",
              description: `Make sure all your teammates join the same team. Max ${TEAM_MAX_MEMBERS} members per team.`,
              children: <StepOne />,
            },
            {
              order: 2,
              title: "Submit your bot code",
              description:
                "Upload your poker bot code. You must submit your code in order to participate in the tournament.",
              children: <div>Step 2 content</div>,
              disabled: !data?.team, // Disabled if not in a team (step 1)
            },
            {
              order: 3,
              title: "Review tournament rules",
              description:
                "Make sure you understand the tournament rules and regulations before participating.",
              children: <div>Step 3 content</div>,
              disabled: !data?.team || !data.team.has_submitted_code, // Disabled if not in a team (step 1) or if bot code is not submitted (step 2)
            },
          ]}
        />
      </section>
    </main>
  );
}
