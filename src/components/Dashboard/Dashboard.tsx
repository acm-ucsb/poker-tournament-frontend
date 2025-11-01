"use client";

import { BreadcrumbBuilder } from "../BreadcrumbBuilder";
import { ActionSteps } from "@/components/Actions/ActionSteps";
import { useData } from "@/providers/DataProvider";
import { TEAM_MAX_MEMBERS } from "@/lib/constants";
import { ManageTeam } from "@/components/Dashboard/Steps/ManageTeam";
import { useAuth } from "@/providers/AuthProvider";
import { SubmitCode } from "@/components/Dashboard/Steps/SubmitCode";
import { ReviewRules } from "@/components/Dashboard/Steps/ReviewRules";
import { ReviewSubGuide } from "@/components/Dashboard/Steps/ReviewSubGuide";
import { CountdownTimer } from "@/components/Dashboard/CountdownTimer";
import { ViewTables } from "./Steps/ViewTables";
import { useLocalStorage } from "@mantine/hooks";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoaderComponent } from "../LoaderComponent";
import moment from "moment";

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

  const [hasReadSubmissionGuide] = useLocalStorage({
    key: "read-submission-guide",
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

  const isHuman = data?.type === "human" || data?.team?.type === "human";
  const hasRegistrationOpened =
    tourneyData?.start_time && moment().isAfter(moment(tourneyData.start_time));
  const hasTournamentStarted = tourneyData?.status !== "not_started";

  return (
    <main className="flex flex-col w-full max-w-7xl self-center pb-6">
      <BreadcrumbBuilder
        previousPages={[{ title: "Home", link: "/" }]}
        currentPage={{ title: "Dashboard" }}
      />
      {/* Dashboard content */}
      <section className="flex flex-col mt-6">
        {/* <h2 className="text-2xl font-bold mb-4">Dashboard</h2> */}
        {!data?.is_admin && (
          <>
            {tourneyData?.start_time && (
              <div className="mb-12">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter text-center mb-4">
                  Registration opens in
                </h1>
                <CountdownTimer targetDate={new Date(tourneyData.start_time)} />
              </div>
            )}
            <ActionSteps
              loading={isLoading || auth.loadingAuth}
              steps={[
                {
                  title: "Review tournament rules",
                  description:
                    "Please review our tournament rules before participating.",
                  children: <ReviewRules />,
                  disabled: !auth.user?.email?.includes("ucsb.edu"), // User must have a ucsb.edu email
                  completed: hasAcknowledgedRules, // Completed if rules are acknowledged or user is in a team
                },
                {
                  title: "Create or join a team",
                  description: `Make sure all your teammates join the same team. Max ${TEAM_MAX_MEMBERS} members per team.`,
                  children: <ManageTeam />,
                  disabled:
                    !hasAcknowledgedRules ||
                    !hasRegistrationOpened ||
                    hasTournamentStarted, // Disabled until rules are acknowledged and if registration is not opened
                  completed: !!data?.team,
                },
                {
                  title: "Review submission guideline",
                  description:
                    "Please review the submission guideline before submitting your bot.",
                  children: <ReviewSubGuide />,
                  disabled: !data?.team || !hasAcknowledgedRules,
                  completed: hasReadSubmissionGuide,
                },
                {
                  title: "Submit your bot code",
                  description:
                    "You must submit your code in order to participate in the tournament.",
                  children: <SubmitCode />,
                  disabled:
                    !hasReadSubmissionGuide ||
                    !data?.team ||
                    !hasAcknowledgedRules ||
                    isHuman ||
                    !hasRegistrationOpened ||
                    hasTournamentStarted, // Disabled until team is joined/created and if registration is not opened
                  completed: !!data?.team?.has_submitted_code,
                  incomplete: isHuman,
                },
                {
                  title: "View tournament tables",
                  description:
                    "Join your assigned table or spectate other games in the tournament.",
                  children: <ViewTables />,
                  completed:
                    !!data?.team?.table ||
                    (hasTournamentStarted && !!data?.team?.table),
                  incomplete:
                    hasTournamentStarted &&
                    !!data?.team &&
                    !data?.team?.table &&
                    data?.team?.has_submitted_code,
                },
              ]}
            />
          </>
        )}
      </section>
    </main>
  );
}
