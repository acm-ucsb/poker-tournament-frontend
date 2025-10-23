"use client";

import { useData } from "@/providers/DataProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";

import { useEffect, useState } from "react";
import { updateDeadlines } from "@/lib/server-actions/admin/updateDeadlines";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../ui/alert-dialog";
import { startTournament } from "@/lib/server-actions/admin/startTournament";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DateTimePicker } from "@/components/DateTimePicker";
import { ButtonWrapper } from "@/components/ButtonWrapper";
import {
  POLL_INTERVAL_MS,
  UCSB_ACTIVE_POKER_TOURNEY_ID,
  UCSB_HUMAN_POKER_TOURNEY_ID,
} from "@/lib/constants";
import { IconArrowRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useWindowEvent } from "@mantine/hooks";
import { usePathname, useRouter } from "next/navigation";
import { useAdminGameLoop } from "@/providers/AdminGameLoopProvider";

const formSchema = z.object({
  teamsDeadline: z
    .date()
    .nullable()
    .optional()
    .refine((date) => (date ? date > new Date() : true), {
      message: "Teams deadline must be in the future.",
    }),
  submissionsDeadline: z
    .date()
    .nullable()
    .optional()
    .refine((date) => (date ? date > new Date() : true), {
      message: "Submissions deadline must be in the future.",
    }),
});

export function ManageTournament() {
  const { tourneyData, mutate } = useData();
  const adminGameLoop = useAdminGameLoop();
  const [deadlineChangesLoading, setDeadlineChangesLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamsDeadline: tourneyData?.teams_deadline
        ? new Date(tourneyData?.teams_deadline)
        : null,
      submissionsDeadline: tourneyData?.submissions_deadline
        ? new Date(tourneyData?.submissions_deadline)
        : null,
    },
  });

  const onSubmitDeadlines = async (values: z.infer<typeof formSchema>) => {
    setDeadlineChangesLoading(true);

    const res = await updateDeadlines({
      teamsDeadline: values.teamsDeadline,
      submissionsDeadline: values.submissionsDeadline,
    });

    if (res.success) {
      toast.success("Deadlines updated successfully!", {
        richColors: true,
      });
      mutate();
    } else {
      toast.error(`Error updating deadlines: ${res.error?.message}`, {
        richColors: true,
      });
    }

    setDeadlineChangesLoading(false);
  };

  return (
    <section className="flex flex-col gap-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitDeadlines)}>
          <h4 className="text-md mb-1 font-medium">Update Deadlines</h4>
          <p className="mt-0 text-gray-300 text-sm">
            Enter the deadlines for teams and submissions.
          </p>
          <div className="flex flex-col items-start justify-center mt-2 gap-2">
            <FormField
              control={form.control}
              name="teamsDeadline"
              disabled={deadlineChangesLoading}
              render={({ field, fieldState }) => (
                <FormItem className="w-full">
                  <FormLabel>Teams Deadline</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      className={
                        fieldState.invalid
                          ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500 focus:!ring-1"
                          : undefined
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="submissionsDeadline"
              disabled={deadlineChangesLoading}
              render={({ field, fieldState }) => (
                <FormItem className="w-full">
                  <FormLabel>Submissions Deadline</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      className={
                        fieldState.invalid
                          ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500 focus:!ring-1"
                          : undefined
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <ButtonWrapper
              type="submit"
              loading={deadlineChangesLoading}
              className="w-full"
              disabled={!form.formState.isDirty}
            >
              Update Deadlines
            </ButtonWrapper>
          </div>
        </form>
      </Form>

      <h4 className="text-md mb-1 font-medium">Tournament</h4>
      {tourneyData?.status === "active" ? (
        <div className="flex gap-2">
          <ButtonWrapper
            className="grow"
            size={"lg"}
            variant={"outline"}
            disabled
          >
            Tournament Is Active
          </ButtonWrapper>

          <ButtonWrapper className="group" href="/dashboard/tables">
            <div className="flex items-center justify-center gap-2 px-3">
              View All Tables
              <IconArrowRight className="group-hover:translate-x-1.5 transition-all" />
            </div>
          </ButtonWrapper>
        </div>
      ) : (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <ButtonWrapper size={"lg"} variant={"destructive"}>
              Start The Tournament
            </ButtonWrapper>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will start the tournament, create the necessary
                tables based on the number of players with submitted code, and
                begin play. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  toast.loading("Starting tournament, please wait...", {
                    richColors: true,
                    id: "start-tournament",
                  });

                  const res = await startTournament();

                  if (res.success) {
                    toast.success("Tournament started.", {
                      richColors: true,
                      id: "start-tournament",
                    });
                    mutate();
                  } else {
                    toast.error(res.error?.message, {
                      richColors: true,
                      id: "start-tournament",
                    });
                  }
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {tourneyData?.status === "active" &&
        (adminGameLoop.intervalId ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="grow" size={"lg"} variant={"warning"}>
                Pause Tables
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will pause all tournament tables and stop play.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={adminGameLoop.onStopTables}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="grow" size={"lg"} variant={"success"}>
                Start Tables
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will start all tournament tables and begin play.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={adminGameLoop.onStartTables}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ))}
    </section>
  );
}
