"use client";

import { useAuth } from "@/providers/AuthProvider";
import { BreadcrumbBuilder } from "../BreadcrumbBuilder";
import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";
import { IconCopy } from "@tabler/icons-react";
import { ButtonWrapper } from "../ButtonWrapper";
import { toast } from "sonner";
import { getSubmission } from "@/lib/server-actions/submission-actions/getSubmission";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LoaderComponent } from "../LoaderComponent";
import { getTeamSubmission } from "@/lib/server-actions/admin/getTeamSubmission";

export function AdminSubmissionPage({
  params,
}: {
  params: Promise<{ team_id: string }>;
}) {
  const router = useRouter();
  const auth = useAuth();

  const [submissionCodeHtml, setSubmissionCodeHtml] = useState<string>("");
  const [submissionCode, setSubmissionCode] = useState<string>("");
  const [team, setTeam] = useState<Team>();

  useEffect(() => {
    if (auth.loadingAuth || !auth.session?.access_token) return;

    params.then((p) => {
      getTeamSubmission({ teamId: p.team_id }).then((response) => {
        if (!response.success || !response.data) {
          toast.error("Failed to fetch submission", {
            richColors: true,
          });

          router.replace("/dashboard");
          return;
        }

        setTeam(response.data.team);

        setSubmissionCode(response.data.code);
        codeToHtml(response.data.code, {
          lang: response.data.language || "plaintext",
          theme: "github-dark-default",
        }).then((html) => {
          setSubmissionCodeHtml(html);
        });
      });
    });
  }, []);

  return (
    <main className="flex flex-col w-full max-w-7xl self-center pb-4 grow">
      <BreadcrumbBuilder
        previousPages={[
          { title: "Home", link: "/" },
          { title: "Admin Panel", link: "/dashboard/admin" },
        ]}
        currentPage={{
          title: team ? `${team.name}'s Submission` : "Loading...",
        }}
      />
      {/* Team Information */}
      <section className="flex flex-col mt-6 grow">
        <h2 className="text-2xl font-bold mb-2">
          {team ? `${team.name}'s Submission` : "Loading..."}
        </h2>
        {!submissionCodeHtml || !team ? (
          <LoaderComponent />
        ) : (
          <div className="relative">
            <div
              className="border rounded-md shiki-container z-0"
              dangerouslySetInnerHTML={{ __html: submissionCodeHtml }}
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <ButtonWrapper
                  className="absolute right-2 top-2 z-50 w-8 h-8 p-1.5 cursor-pointer"
                  variant={"outline"}
                  onClick={() => {
                    navigator.clipboard.writeText(submissionCode);
                    toast.info(
                      `${team.name}'s submission copied to clipboard`,
                      {
                        richColors: true,
                      }
                    );
                  }}
                >
                  <IconCopy className="w-full h-full text-white opacity-70" />
                </ButtonWrapper>
              </TooltipTrigger>
              <TooltipContent>Copy {team.name}'s Submission</TooltipContent>
            </Tooltip>
          </div>
        )}
      </section>
    </main>
  );
}
