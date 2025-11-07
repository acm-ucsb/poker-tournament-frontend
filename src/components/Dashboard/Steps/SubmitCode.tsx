import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useData } from "@/providers/DataProvider";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  DISQUALIFICATION_MESSAGE,
  SUBMISSION_MAX_FILE_SIZE,
} from "@/lib/constants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useState, useRef, useEffect } from "react";
import { ButtonWrapper } from "@/components/ButtonWrapper";
import { toast } from "sonner";
import moment from "moment";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createSubmission } from "@/lib/server-actions/submission-actions/createSubmission";

const submissionSchema = z.object({
  file: z
    .file()
    .min(1, { message: "A file is required." })
    .max(SUBMISSION_MAX_FILE_SIZE, {
      message: `Max file size is ${SUBMISSION_MAX_FILE_SIZE} bytes.`,
    })
    .refine(
      (file) =>
        [".cpp", ".py"].some((ext) => file.name.toLowerCase().endsWith(ext)),
      { message: "Only .cpp and .py files are allowed." }
    ),
});

export function SubmitCode() {
  const { data, teamData, tourneyData, mutate } = useData();
  const [submittingCode, setSubmittingCode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [deadlinePassed, setDeadlinePassed] = useState(false);

  const submissionForm = useForm({
    resolver: zodResolver(submissionSchema),
  });

  const onSubmitSubmission = async (
    formData: z.infer<typeof submissionSchema>
  ) => {
    if (teamData?.is_disqualified) {
      toast.error(DISQUALIFICATION_MESSAGE, {
        richColors: true,
      });
      return;
    }

    setSubmittingCode(true);

    const newFormData = new FormData();
    newFormData.append("file", formData.file);

    const res = await createSubmission({
      file: formData.file,
    });

    if (res.success) {
      toast.success("Your code has been successfully submitted!", {
        richColors: true,
      });
      mutate();
    } else {
      toast.error(
        res.error?.message || "There was an error submitting your code.",
        {
          description: res.error?.details || "Please try again later.",
          richColors: true,
        }
      );
    }

    submissionForm.reset();
    setSubmittingCode(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (tourneyData?.submissions_deadline) {
      const deadline = moment(tourneyData.submissions_deadline);
      const now = moment();

      setDeadlinePassed(now.isAfter(deadline));

      if (deadline.isAfter(now)) {
        const timeoutDuration = Math.min(
          deadline.diff(now),
          Math.pow(2, 31) - 1 // max setTimeout duration
        );

        const timer = setTimeout(() => {
          mutate();
          setDeadlinePassed(true);
          toast.info(
            "Submission deadline has passed. You can no longer submit or modify your code.",
            {
              richColors: true,
            }
          );
        }, timeoutDuration);

        return () => clearTimeout(timer);
      }
    }
  }, [tourneyData?.submissions_deadline, mutate]);

  const isSubmissionDisabled =
    deadlinePassed ||
    tourneyData?.status !== "not_started" ||
    teamData?.is_disqualified;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-lg font-semibold">Your Tournament Submission</h2>
        {!isSubmissionDisabled ? (
          <>
            <p className="mt-0 text-gray-300 text-sm">
              Please ensure that your code follows our submission guidelines
              above.
            </p>
            <p className="mt-0 text-sm">
              Once you submit your code, you will be able to view your previous
              submission and re-submit your code at any time{" "}
              <strong>before the submission deadline</strong>.
            </p>
            <Tooltip>
              <TooltipTrigger className="w-max">
                <p className="mt-0 text-red-300 text-sm">
                  Submissions close on{" "}
                  {moment(tourneyData?.submissions_deadline).format(
                    "MMMM Do YYYY, h:mm:ss a"
                  )}
                  .
                </p>
              </TooltipTrigger>
              <TooltipContent>
                Submissions close{" "}
                {moment(tourneyData?.submissions_deadline).fromNow()}
              </TooltipContent>
            </Tooltip>
          </>
        ) : (
          <p className="mt-0 text-red-300 text-sm">
            {teamData?.is_disqualified
              ? DISQUALIFICATION_MESSAGE
              : "Submissions are now closed."}
          </p>
        )}
      </div>
      {!isSubmissionDisabled && (
        <Form {...submissionForm}>
          <form
            onSubmit={submissionForm.handleSubmit(onSubmitSubmission)}
            className="w-full flex gap-2"
          >
            <FormField
              control={submissionForm.control}
              name="file"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      type="file"
                      placeholder="Upload your bot code"
                      accept=".zip,.tar,.gz,.py,.cpp"
                      disabled={submittingCode}
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={(e) => {
                        field.ref(e);
                        fileInputRef.current = e;
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <ButtonWrapper
              className="w-min"
              type="submit"
              loading={submittingCode}
            >
              {data?.team?.has_submitted_code ? "Resubmit" : "Submit"}
            </ButtonWrapper>
          </form>
        </Form>
      )}
      {data?.team?.has_submitted_code && (
        <Link href="/dashboard/myteam/submission" className="w-full">
          <Button variant="outline" className="w-full">
            View Current Submission
          </Button>
        </Link>
      )}
    </section>
  );
}
