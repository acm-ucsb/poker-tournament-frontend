"use server";

import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";
import { ServerActionError, ServerActionResponse } from "../types";

type Params = {
  teamId: string;
  newName: string;
};

export async function renameTeam(
  params: Params
): Promise<ServerActionResponse<null>> {
  const { teamId, newName } = params;

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

    // check if team with team id exists
    const { data: team } = await supabase
      .from("teams")
      .select("*")
      .eq("id", teamId)
      .single();

    if (!team) {
      throw new ServerActionError({
        message: "Team not found.",
        code: "BAD_REQUEST",
        status: 400,
      });
    }

    // check if user is owner of the team
    if (user.id !== team.owner_id) {
      throw new ServerActionError({
        message: "You are not the owner of this team.",
        code: "UNAUTHORIZED",
        status: 403,
      });
    }

    // check if team already exists with the new name or if old name is same as new name
    if (team.name === newName) {
      throw new ServerActionError({
        message: "Team name is the same as the old name.",
        code: "BAD_REQUEST",
        status: 400,
      });
    }

    // update team name
    await supabase
      .from("teams")
      .update({ name: newName })
      .eq("id", teamId)
      .throwOnError();

    return {
      success: true,
      status: 200,
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
