"use server";

import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";
import { ServerActionError, ServerActionResponse } from "../types";

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
      .insert({ name: teamName, owner_id: user.id })
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
    console.log(error);
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
