"use server";

import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";
import { ServerActionError } from "../types";
import { supabaseAdmin } from "@/lib/supabase/supabase-admin";
import { UCSB_POKER_TOURNEY_ID } from "@/lib/constants";
import moment from "moment";

type Params = {
  teamId: string;
  userId: string;
};

export async function removeTeamMember(params: Params) {
  const { teamId, userId } = params;

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
        message: "You must use a UCSB email to remove a team member.",
        code: "FORBIDDEN",
        status: 403,
      });
    }

    // check if tournaments.teams_deadline has passed
    const { data: tournament } = await supabase
      .from("tournaments")
      .select("teams_deadline")
      .eq("id", UCSB_POKER_TOURNEY_ID) // hardcoded for now
      .single()
      .throwOnError();

    if (moment().isAfter(moment(tournament?.teams_deadline))) {
      throw new ServerActionError({
        message: "Team changes have been disabled for this tournament.",
        code: "FORBIDDEN",
        status: 403,
      });
    }

    const { data: team, error: teamError } = await supabase
      .from("teams")
      .select("*")
      .eq("id", teamId)
      .single();

    // check if user is removing themselves and they are owner
    if (user.id === userId && user.id === team.owner_id) {
      throw new ServerActionError({
        message: "You cannot remove yourself from the team.",
        code: "BAD_REQUEST",
        status: 400,
      });
    }

    // check if team exists
    if (teamError || !team) {
      throw new ServerActionError({
        message: "Team not found.",
        code: "NOT_FOUND",
        status: 404,
      });
    }

    // check if current user is owner of the team and they are removing someone other than themselves
    if (user.id !== team.owner_id && user.id !== userId) {
      throw new ServerActionError({
        message: "You are not the owner of this team.",
        code: "UNAUTHORIZED",
        status: 403,
      });
    }

    // check if userId is part of the team
    const { data: userInTeam, error: userInTeamError } = await supabase
      .from("users")
      .select("id")
      .eq("id", userId)
      .eq("team_id", teamId)
      .single();

    if (userInTeamError || !userInTeam) {
      throw new ServerActionError({
        message: "User is not a member of this team.",
        code: "NOT_FOUND",
        status: 404,
      });
    }

    // Remove user from team
    await supabaseAdmin
      .from("users")
      .update({ team_id: null })
      .eq("id", userId)
      .eq("team_id", teamId)
      .throwOnError();

    return {
      success: true,
      status: 200,
      error: null,
      data: null,
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
