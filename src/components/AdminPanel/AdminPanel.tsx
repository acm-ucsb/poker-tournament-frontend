"use client";

import { useData } from "@/providers/DataProvider";
import { BreadcrumbBuilder } from "../BreadcrumbBuilder";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { DateTimePicker } from "../DateTimePicker";
import { useState } from "react";
import { ButtonWrapper } from "../ButtonWrapper";
import { updateDeadlines } from "@/lib/server-actions/admin/updateDeadlines";
import { toast } from "sonner";

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

export function AdminPanel() {
  const { data, tourneyData, mutate } = useData();
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
    <main className="flex flex-col w-full max-w-7xl self-center pb-6">
      <BreadcrumbBuilder
        previousPages={[{ title: "Home", link: "/" }]}
        currentPage={{ title: "Admin Panel", link: "/dashboard/admin" }}
      />
      {/* Dashboard content */}
      <section className="flex flex-col mt-6">
        <h2 className="text-2xl font-bold mb-2">Admin Panel</h2>
        {/*
        
          What we want to manage in this panel:
            - starting the tournament
              This needs to do the following in order:
                1. Create X number of tables, based on the number of players WITH SUBMITTED CODE
                2. Assign players to tables randomly (the backend fastapi server can decide where to position players?, or should this be stored in DB?)
                3. Start the tournament by setting the status of the tournament to "active"
            - Viewing and updating the teams deadline
            - Viewing and updating the submissions deadline
            - Manage teams (rename, remove, view code)
              - if code is against the rules, disqualify team
            - Manage players (remove)

        */}
        <h3 className="text-lg font-semibold my-3">Manage Tournament</h3>
        <section>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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
          {/* 
            - Form to start the tournament, set teams deadline, set submissions deadline
          */}
        </section>
        <h3 className="text-lg font-semibold my-3">Manage Teams</h3>
        <section>
          {/* 
            - Form to view and update teams (rename, remove, view code)
          */}
        </section>
        <h3 className="text-lg font-semibold my-3">Manage Players</h3>
        <section>
          {/* 
            - Form to view and update players (remove)
          */}
        </section>
      </section>
    </main>
  );
}
