"use client";

import { useAuth } from "@/providers/AuthProvider";
import { BreadcrumbBuilder } from "../BreadcrumbBuilder";
import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";
import axios from "axios";
import { BACKEND_ENGINE_BASE_URL } from "@/lib/constants";
import { Skeleton } from "../ui/skeleton";
import { getLanguageFromExtension } from "@/lib/utils";
import { IconCopy } from "@tabler/icons-react";
import { ButtonWrapper } from "../ButtonWrapper";
import { toast } from "sonner";
import { getSubmission } from "@/lib/server-actions/submission-actions/getSubmission";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function SubmissionPage() {
  const router = useRouter();
  const auth = useAuth();

  const [submissionCodeHtml, setSubmissionCodeHtml] = useState<string>("");
  const [submissionCode, setSubmissionCode] = useState<string>("");

  useEffect(() => {
    if (auth.loadingAuth || !auth.session?.access_token) return;

    getSubmission().then((response) => {
      if (!response.success || !response.data) {
        toast.error("Failed to fetch submission", {
          richColors: true,
        });

        router.replace("/dashboard");
        return;
      }

      setSubmissionCode(response.data.code);
      codeToHtml(response.data.code, {
        lang: response.data.language || "plaintext",
        theme: "github-dark-default",
      }).then((html) => {
        setSubmissionCodeHtml(html);
      });
    });
  }, []);

  return (
    <main className="flex flex-col w-full max-w-7xl self-center pb-4 grow">
      <BreadcrumbBuilder
        previousPages={[
          { title: "Home", link: "/" },
          { title: "Dashboard", link: "/dashboard" },
          { title: "My Team", link: "/dashboard/myteam" },
        ]}
        currentPage={{
          title: "Submission",
          link: "/dashboard/myteam/submission",
        }}
      />
      {/* Team Information */}
      <section className="flex flex-col mt-6 grow">
        <h2 className="text-2xl font-bold mb-2">Submission Details</h2>
        {!submissionCodeHtml ? (
          <div className="flex items-center justify-center grow">
            <Loader2 className="animate-spin text-green-300" size={40} />
          </div>
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
                    toast.info("Previous submission copied to clipboard", {
                      richColors: true,
                    });
                  }}
                >
                  <IconCopy className="w-full h-full text-white opacity-70" />
                </ButtonWrapper>
              </TooltipTrigger>
              <TooltipContent>Copy previous submission</TooltipContent>
            </Tooltip>
          </div>
        )}
      </section>
    </main>
  );
}
