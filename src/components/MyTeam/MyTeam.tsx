"use client";

import { useAuth } from "@/providers/AuthProvider";
import { useData } from "@/providers/DataProvider";
import { BreadcrumbBuilder } from "../BreadcrumbBuilder";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  deleteTeam,
  joinTeam,
  removeTeamMember,
  renameTeam,
} from "@/lib/server-actions/index";
import { toast } from "sonner";
import { Clipboard, LinkIcon } from "lucide-react";

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
import { UserCard } from "./UserCard";
import { TEAM_MAX_MEMBERS } from "@/lib/constants";
import moment from "moment";
import Link from "next/link";

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

  const { data, teamData, tourneyData, mutate } = useData();

  // Rename form hooks/submit method
  const [renameSubmitLoading, setRenameSubmitLoading] = useState(false);
  const [deleteTeamLoading, setDeleteTeamLoading] = useState(false);
  const [leaveTeamLoading, setLeaveTeamLoading] = useState(false);

  const formRename = useForm<z.infer<typeof formRenameTeam>>({
    resolver: zodResolver(formRenameTeam),
    defaultValues: {
      teamName: "",
    },
  });

  const onSubmitRename = async (values: z.infer<typeof formRenameTeam>) => {
    setRenameSubmitLoading(true);

    if (!data || !data.team) {
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

    setDeleteTeamLoading(true);

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

    setDeleteTeamLoading(false);
  };

  // Leave team method
  const handleLeaveTeam = async () => {
    if (!data?.team || !auth.user) return;

    setLeaveTeamLoading(true);

    // Call server action to remove member
    const response = await removeTeamMember({
      teamId: data.team.id,
      userId: auth.user.id,
    });

    if (response.success) {
      toast.success("Successfully left the team!", {
        richColors: true,
      });
      router.push("/dashboard");
      mutate(); // Refresh data
    } else {
      toast.error(response.error?.message || "Failed to leave team", {
        richColors: true,
      });
    }

    setLeaveTeamLoading(false);
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
    if (!auth.user) {
      return;
    }
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

  if (!data || !data.team || teamInviteId) {
    return null;
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
        <h2 className="text-2xl font-bold mb-2">My Team</h2>

        {data?.team?.owner.id === auth.user?.id && (
          <>
            <h3 className="text-lg font-semibold my-3">Team Settings</h3>
            <div className="flex flex-col gap-3">
              <Form {...formRename}>
                <form onSubmit={formRename.handleSubmit(onSubmitRename)}>
                  <h4 className="text-md mb-1 font-medium">Rename Team</h4>
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
                              placeholder={data?.team?.name}
                              className={
                                fieldState.invalid
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                  : ""
                              }
                              autoCapitalize="off"
                              autoComplete="off"
                              spellCheck="false"
                              autoCorrect="off"
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
              {!moment().isAfter(moment(tourneyData?.teams_deadline)) && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <ButtonWrapper
                      loading={deleteTeamLoading}
                      variant={"destructive"}
                      className="w-full"
                    >
                      Delete Team
                    </ButtonWrapper>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete this team and all its data, including any code
                        submitted.
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
              )}
            </div>
          </>
        )}

        {/* Manage Teammates: remove teammates */}
        <h3 className="text-lg font-semibold my-3">
          {data?.team?.owner.id === auth.user?.id &&
          !moment().isAfter(moment(tourneyData?.teams_deadline))
            ? "Manage"
            : "Your"}{" "}
          Teammates
        </h3>
        <div className="flex flex-col gap-2">
          {teamData
            ? teamData.members
                .slice()
                .sort((a, b) => {
                  // Owner first
                  if (a.id === data.team!.owner.id) return -1;
                  if (b.id === data.team!.owner.id) return 1;
                  // Current user next
                  if (auth.user && a.id === auth.user.id) return -1;
                  if (auth.user && b.id === auth.user.id) return 1;
                  // Then alphabetical
                  return a.name.localeCompare(b.name);
                })
                .map((member) => <UserCard key={member.id} member={member} />)
            : null}
        </div>
        {data?.team?.owner.id !== auth.user?.id &&
          !moment().isAfter(moment(tourneyData?.teams_deadline)) && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <ButtonWrapper
                  loading={leaveTeamLoading}
                  variant={"destructive"}
                  className="mt-3"
                >
                  Leave Team
                </ButtonWrapper>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will remove you from the team. You can be
                    re-invited later.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLeaveTeam}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        {!moment().isAfter(moment(tourneyData?.teams_deadline)) &&
          teamData &&
          teamData?.members.length < TEAM_MAX_MEMBERS && (
            <div className="flex flex-wrap gap-2 w-full mt-3">
              <Button
                className="min-w-24 grow"
                variant={"outline"}
                onClick={() => {
                  const teamId = data.team!.id;
                  const teamInviteLink = `${location.origin}/dashboard/myteam?invite=${teamId}`;

                  navigator.clipboard.writeText(teamInviteLink);
                  toast.success("Invite link copied to clipboard");
                }}
              >
                <LinkIcon />
                Copy Invite Link
              </Button>
              <Button
                className="min-w-24 grow"
                variant={"outline"}
                onClick={() => {
                  const teamId = data.team!.id;

                  navigator.clipboard.writeText(teamId!); // teamId cannot be undefined bc skeleton loading in ActionSteps
                  toast.success("Team ID copied to clipboard");
                }}
              >
                <Clipboard />
                Copy Team ID
              </Button>
            </div>
          )}
        {data?.team?.has_submitted_code && (
          <Link href="/dashboard/myteam/submission" className="w-full mt-2">
            <Button variant="outline" className="w-full">
              View Current Submission
            </Button>
          </Link>
        )}
      </section>
    </main>
  );
}
