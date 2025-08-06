"use client";

import { useAuth } from "@/providers/AuthProvider";
import { useData } from "@/providers/DataProvider";
import { BreadcrumbBuilder } from "../BreadcrumbBuilder";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { deleteTeam, joinTeam, renameTeam } from "@/lib/server-actions/index";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { ButtonWrapper } from "../ButtonWrapper";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogHeader,
} from "../ui/alert-dialog";

const formRenameTeam = z.object({
  teamName: z
    .string()
    .min(3, {
      error: "Team name must be at least 3 characters",
    })
    .max(25, {
      error: "Team name must be at most 25 characters",
    }),
});

export function MyTeam({}) {
  const auth = useAuth();
  const router = useRouter();
  const params = useSearchParams();

  const { data, mutate } = useData();

  // Rename form hooks/submit method
  const [renameSubmitLoading, setRenameSubmitLoading] = useState(false);
  const formRename = useForm<z.infer<typeof formRenameTeam>>({
    resolver: zodResolver(formRenameTeam),
    defaultValues: {
      teamName: "",
    },
  });

  const onSubmitRename = async (values: z.infer<typeof formRenameTeam>) => {
    setRenameSubmitLoading(true);

    if (!data) {
      setRenameSubmitLoading(false);
      toast.error("Failed to rename team. Please try again later.", {
        richColors: true,
      });
      return;
    }

    // Call server action to rename team
    const response = await renameTeam({
      teamId: data.team.id,
      newName: values.teamName,
    });

    if (response.success) {
      toast.success("Team renamed successfully!", {
        richColors: true,
      });
      mutate(); // Refresh data
    } else {
      toast.error(response.error?.message || "Failed to rename team", {
        richColors: true,
      });
    }

    setRenameSubmitLoading(false);
    formRename.reset();
  };

  // Delete team method
  const handleDeleteTeam = async () => {
    if (!data?.team) return;

    const response = await deleteTeam({ teamId: data.team.id });

    if (response.success) {
      toast.success("Team deleted successfully!", {
        richColors: true,
      });
      router.push("/dashboard");
      mutate(); // Refresh data
    } else {
      toast.error(response.error?.message || "Failed to delete team", {
        richColors: true,
      });
    }
  };

  // Check if user is invited to a team via URL
  const teamInviteId = params.get("invite");

  useEffect(() => {
    if (teamInviteId && !data?.team) {
      joinTeam({ teamId: teamInviteId }).then((data) => {
        if (data.success) {
          toast.success("Successfully joined the team!", {
            richColors: true,
          });
        } else {
          toast.error(data.error?.message || "Failed to join team", {
            richColors: true,
          });
        }

        mutate();
        router.push("/dashboard");
      });
    }
  }, [data?.team]);

  // If the user is not in a team, redirect to dashboard
  useEffect(() => {
    if (!data?.team && !teamInviteId) {
      router.replace("/dashboard");
      toast.error(
        "You are not in a team. You must create or join a team before accessing this page.",
        {
          richColors: true,
        }
      );
    }
  }, []);

  if (!data?.team || teamInviteId) {
    return (
      <div className="flex flex-col items-center justify-center w-full grow">
        <Loader2 className="animate-spin text-green-300" size={40} />
      </div>
    );
  }

  return (
    <main className="flex flex-col w-full max-w-7xl self-center">
      <BreadcrumbBuilder
        previousPages={[
          { title: "Home", link: "/" },
          { title: "Dashboard", link: "/dashboard" },
        ]}
        currentPage={{ title: "My Team", link: "/dashboard/myteam" }}
      />
      {/* Team Information */}
      <section className="flex flex-col mt-6">
        <h2 className="text-2xl font-bold mb-4">My Team</h2>

        {data?.team.owner.id === auth.user?.id ? (
          <>
            <h3 className="text-lg font-semibold text-[1.25rem]">
              Team Settings
            </h3>
            <div className="flex flex-col gap-2">
              <Form {...formRename}>
                <form onSubmit={formRename.handleSubmit(onSubmitRename)}>
                  <h4 className="text-md mt-2 mb-1 font-medium">Rename Team</h4>
                  <p className="mt-0 text-gray-300 text-sm">
                    Enter a new name for your team. This will be visible to
                    everyone.
                  </p>
                  <div className="flex items-start justify-center mt-2 gap-2">
                    <FormField
                      control={formRename.control}
                      name="teamName"
                      disabled={renameSubmitLoading}
                      render={({ field, fieldState }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={data?.team.name}
                              className={
                                fieldState.invalid
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                  : ""
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <ButtonWrapper
                      type="submit"
                      loading={renameSubmitLoading}
                      className="w-20"
                    >
                      Rename
                    </ButtonWrapper>
                  </div>
                </form>
              </Form>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant={"destructive"} className="w-full">
                    Delete Team
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      this team and all its data, including any code submitted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteTeam}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            {/* Manage Teammates: remove teammates */}
            <h3 className="text-lg font-semibold my-2">Manage Teammates</h3>
          </>
        ) : null}
      </section>
    </main>
  );
}
