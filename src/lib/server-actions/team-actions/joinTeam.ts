"use server";

import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";
import { ServerActionError, ServerActionResponse } from "../types";
import {
  TEAM_MAX_MEMBERS,
  UCSB_ACTIVE_POKER_TOURNEY_ID,
} from "@/lib/constants";
import moment from "moment";

type Params = {
  teamId: string;
};

export async function joinTeam(
  params: Params
): Promise<ServerActionResponse<null>> {
  const { teamId } = params;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new ServerActionError({
        message: "You must be logged in to join a team.",
        code: "UNAUTHORIZED",
        status: 401,
      });
    }

    if (!user.email?.includes("@ucsb.edu")) {
      throw new ServerActionError({
        message: "You must use a UCSB email to join a team.",
        code: "FORBIDDEN",
        status: 403,
      });
    }

    // Security checks
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
    // Check if user is already part of a team
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

    // Check if team exists
    const { data: team } = await supabase
      .from("teams")
      .select("*")
      .eq("id", teamId)
      .single();

    if (!team) {
      throw new ServerActionError({
        message: "Team not found",
        code: "BAD_REQUEST",
        status: 400,
      });
    }

    // check if max players limit is reached
    const { count: playerCount } = await supabase
      .from("users")
      .select("*", { count: "exact" })
      .eq("team_id", teamId);

    if (!playerCount || playerCount >= TEAM_MAX_MEMBERS) {
      throw new ServerActionError({
        message: "Team is already full",
        code: "BAD_REQUEST",
        status: 400,
      });
    }

    // Add user to team
    await supabase
      .from("users")
      .update({
        team_id: team.id,
      })
      .eq("id", user.id)
      .throwOnError();

    return {
      success: true,
      data: null,
      error: null,
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
