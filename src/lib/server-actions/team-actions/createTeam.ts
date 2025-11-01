"use server";

import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";
import { ServerActionError, ServerActionResponse } from "../types";
import { UCSB_ACTIVE_POKER_TOURNEY_ID } from "@/lib/constants";
import moment from "moment";
import { Team } from "@/lib/types";

type Params = {
  teamName: string;
};

export async function createTeam(
  params: Params
): Promise<ServerActionResponse<Team>> {
  const { teamName } = params;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new ServerActionError({
        message: "You must be logged in to create a team.",
        code: "UNAUTHORIZED",
        status: 401,
      });
    }

    if (!user.email?.includes("@ucsb.edu")) {
      throw new ServerActionError({
        message: "You must use a UCSB email to create a team.",
        code: "FORBIDDEN",
        status: 403,
      });
    }

    // check if tournaments.teams_deadline has passed
    const { data: tournament } = await supabase
      .from("tournaments")
      .select("teams_deadline, status, start_time")
      .eq("id", UCSB_ACTIVE_POKER_TOURNEY_ID) // hardcoded for now
      .single()
      .throwOnError();

    // Check if the current time is before the registration start_time
    if (moment().isBefore(moment(tournament?.start_time))) {
      throw new ServerActionError({
        message: "Registration has not opened yet.",
        code: "FORBIDDEN",
        status: 403,
      });
    }

    if (
      moment().isAfter(moment(tournament?.teams_deadline)) ||
      tournament?.status !== "not_started"
    ) {
      throw new ServerActionError({
        message: "The team registration deadline has passed.",
        code: "FORBIDDEN",
        status: 403,
      });
    }

    // check if user is already part of a team
    const { data: existingTeam } = await supabase
      .from("users")
      .select("team_id")
      .eq("id", user.id)
      .single()
      .throwOnError();

    if (existingTeam.team_id) {
      throw new ServerActionError({
        message: "You are already in a team.",
        code: "BAD_REQUEST",
        status: 400,
      });
    }

    // check if team with the same name already exists
    const { data: existingTeamByName } = await supabase
      .from("teams")
      .select("*")
      .eq("name", teamName)
      .single();

    if (existingTeamByName) {
      throw new ServerActionError({
        message:
          "Team with this name already exists. Please choose another name.",
        code: "BAD_REQUEST",
        status: 400,
      });
    }

    // create new team + add user to it
    const { data: newTeam } = await supabase
      .from("teams")
      .insert({
        name: teamName,
        owner_id: user.id,
        tournament_id: UCSB_ACTIVE_POKER_TOURNEY_ID,
      })
      .select("*")
      .single()
      .throwOnError();

    await supabase
      .from("users")
      .update({ team_id: newTeam.id })
      .eq("id", user.id)
      .throwOnError();

    return {
      success: true,
      data: newTeam,
      error: null,
      status: 200,
    };
  } catch (error) {
    if (error instanceof ServerActionError) {
      return {
        success: false,
        status: error.status,
        error: {
          code: error.code,
          message: error.message,
        },
        data: null,
      };
    }

    return {
      success: false,
      status: 500,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
        details: error,
      },
      data: null,
    };
  }
}
