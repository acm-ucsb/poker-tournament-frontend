"use server";

import { createSupabaseServerClient } from "../supabase/supabase-server";
import { ServerActionError, ServerActionResponse } from "./types";

type Params = {
  teamId: string;
};

export async function joinTeam(
  params: Params
): Promise<ServerActionResponse<null>> {
  const { teamId } = params;

  const supabase = await createSupabaseServerClient();
  const user = await supabase.auth.getUser();

  try {
    // Security checks
    // Check if user is already part of a team
    const { data: existingTeam } = await supabase
      .from("users")
      .select("team_id")
      .eq("id", user.data.user?.id)
      .single()
      .throwOnError();

    if (existingTeam.team_id) {
      throw new ServerActionError({
        message: "You are already in a team",
        code: "ALREADY_IN_TEAM",
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
        code: "TEAM_NOT_FOUND",
        status: 400,
      });
    }

    // Add user to team
    await supabase
      .from("users")
      .update({
        team_id: team.id,
      })
      .eq("id", user.data.user?.id)
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
