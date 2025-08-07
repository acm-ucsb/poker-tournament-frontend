"use server";

import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";
import { ServerActionError } from "../types";
import { supabaseAdmin } from "@/lib/supabase/supabase-admin";

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

    // check if user is removing themselves
    if (user.id === userId) {
      throw new ServerActionError({
        message: "You cannot remove yourself from the team.",
        code: "BAD_REQUEST",
        status: 400,
      });
    }

    // check if team exists
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .select("*")
      .eq("id", teamId)
      .single();

    if (teamError || !team) {
      throw new ServerActionError({
        message: "Team not found.",
        code: "NOT_FOUND",
        status: 404,
      });
    }

    // check if current user is owner of the team
    if (user.id !== team.owner_id) {
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
    const test = await supabaseAdmin
      .from("users")
      .update({ team_id: null })
      .eq("id", userId)
      .eq("team_id", teamId)
      .throwOnError();

    console.log(test);

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
