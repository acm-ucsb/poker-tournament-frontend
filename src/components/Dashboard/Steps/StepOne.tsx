"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/providers/AuthProvider";
import { useData } from "@/providers/DataProvider";
import { IconUsersGroup } from "@tabler/icons-react";
import { Clipboard, LinkIcon, Settings2 } from "lucide-react";
import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { joinTeam, createTeam } from "@/lib/server-actions/index";
import { useState } from "react";
import { ButtonWrapper } from "@/components/ButtonWrapper";

const formSchemaTeamId = z.object({
  teamId: z.uuid({ error: "Invalid team ID" }),
});

const formSchemaTeamName = z.object({
  teamName: z
    .string()
    .min(3, {
      error: "Team name must be at least 3 characters",
    })
    .max(25, {
      error: "Team name must be at most 25 characters",
    }),
});

export function StepOne() {
  const auth = useAuth();
  const { data, mutate } = useData();

  const [teamIdSubmitLoading, setTeamIdSubmitLoading] = useState(false);
  const [teamNameSubmitLoading, setTeamNameSubmitLoading] = useState(false);

  const formTeamId = useForm<z.infer<typeof formSchemaTeamId>>({
    resolver: zodResolver(formSchemaTeamId),
    defaultValues: {
      teamId: "",
    },
  });

  const formTeamName = useForm<z.infer<typeof formSchemaTeamName>>({
    resolver: zodResolver(formSchemaTeamName),
    defaultValues: {
      teamName: "",
    },
  });

  const onSubmitTeamId = async (data: z.infer<typeof formSchemaTeamId>) => {
    setTeamIdSubmitLoading(true);
    const response = await joinTeam({
      teamId: data.teamId,
    });

    if (response.success) {
      toast.success("Successfully joined the team!", {
        richColors: true,
      });
      mutate(); // Refresh data after joining team
    } else {
      toast.error(response.error?.message || "Failed to join team", {
        richColors: true,
      });
    }

    // reset states
    formTeamId.reset();
    formTeamName.reset();
    setTeamIdSubmitLoading(false);
  };

  const onSubmitTeamName = async (data: z.infer<typeof formSchemaTeamName>) => {
    setTeamNameSubmitLoading(true);

    const response = await createTeam({
      teamName: data.teamName,
    });

    if (response.success) {
      toast.success("Team created successfully!", {
        description: "Make sure to invite your teammates!",
        richColors: true,
        duration: 10000,
      });
      mutate(); // Refresh data after creating team
    } else {
      toast.error(response.error?.message || "Failed to create team", {
        richColors: true,
      });
    }

    // reset states
    formTeamId.reset();
    formTeamName.reset();
    setTeamNameSubmitLoading(false);
  };

  return (
    <section className="flex flex-col gap-0.5">
      {!data?.team ? (
        <>
          <Form {...formTeamId}>
            <form onSubmit={formTeamId.handleSubmit(onSubmitTeamId)}>
              <h2 className="text-lg font-semibold">Join a team</h2>
              <p className="mt-0 text-gray-300 text-sm">
                Enter the team ID from your team leader's dashboard.
              </p>
              <div className="flex items-start justify-center mt-2 gap-2">
                <FormField
                  control={formTeamId.control}
                  name="teamId"
                  disabled={teamIdSubmitLoading}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input placeholder="Enter team ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <ButtonWrapper
                  type="submit"
                  loading={teamIdSubmitLoading}
                  className="w-20"
                >
                  Join
                </ButtonWrapper>
              </div>
            </form>
          </Form>
          <div className="flex items-center mt-2 mb-1">
            <span className="flex-grow border-t border-gray-400"></span>
            <span className="px-2 text-sm text-gray-400">OR</span>
            <span className="flex-grow border-t border-gray-400"></span>
          </div>
          <Form {...formTeamName}>
            <form onSubmit={formTeamName.handleSubmit(onSubmitTeamName)}>
              <h2 className="text-lg font-semibold">Create a team</h2>
              <p className="mt-0 text-gray-300 text-sm">
                Enter a team name and invite your friends to join.
              </p>
              <div className="flex items-start justify-center mt-2 gap-2">
                <FormField
                  control={formTeamName.control}
                  name="teamName"
                  disabled={teamNameSubmitLoading}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input placeholder="Enter team name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <ButtonWrapper
                  type="submit"
                  className="w-20"
                  loading={teamNameSubmitLoading}
                >
                  Create
                </ButtonWrapper>
              </div>
            </form>
          </Form>
        </>
      ) : (
        <>
          <h2 className="text-lg font-semibold">Your Team</h2>
          <p className="mt-0 text-gray-300 text-sm">
            You are currently
            <span>
              {data.team.owner.id === auth.user?.id
                ? " the owner "
                : " a member "}
            </span>
            of team <strong>{data.team.name}</strong>
          </p>
          <div className="grid *:grid-cols-1 md:grid-cols-5 gap-2 mt-2">
            <Link
              href={`/dashboard/myteam`}
              className="md:col-span-3 min-w-40 grow"
            >
              {data.team.owner.id === auth.user?.id ? (
                <Button className="w-full">
                  <Settings2 />
                  Manage Team
                </Button>
              ) : (
                <Button className="bg-green-100 hover:bg-[#c7fad9] w-full">
                  <IconUsersGroup />
                  View Team
                </Button>
              )}
            </Link>
            <div className="flex gap-2 w-full md:col-span-2">
              <Button
                className="min-w-24 grow"
                variant={"outline"}
                onClick={() => {
                  const teamId = data.team.id;
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
                  const teamId = data.team.id;

                  navigator.clipboard.writeText(teamId!); // teamId cannot be undefined bc skeleton loading in ActionSteps
                  toast.success("Team ID copied to clipboard");
                }}
              >
                <Clipboard />
                Copy Team ID
              </Button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
