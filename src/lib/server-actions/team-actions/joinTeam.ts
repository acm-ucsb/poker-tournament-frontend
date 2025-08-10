"use server";

import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";
import { ServerActionError, ServerActionResponse } from "../types";
import { TEAM_MAX_MEMBERS } from "@/lib/constants";

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

    // Security checks
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
