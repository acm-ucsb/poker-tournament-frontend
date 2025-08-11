"use server";

import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";
import { ServerActionError, ServerActionResponse } from "../types";
import { UCSB_POKER_TOURNEY_ID } from "@/lib/constants";
import moment from "moment";

type Params = {
  teamId: string;
};

export async function deleteTeam(
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

    // check if team with team id exists
    const { data: team } = await supabase
      .from("teams")
      .select("*")
      .eq("id", teamId)
      .single()
      .throwOnError();

    if (!team) {
      throw new ServerActionError({
        message: "Team not found",
        code: "BAD_REQUEST",
        status: 400,
      });
    }

    // check if user is the owner of the team
    if (team.owner_id !== user.id) {
      throw new ServerActionError({
        message: "You are not the owner of this team.",
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

    // delete the team
    await supabase.from("teams").delete().eq("id", teamId).throwOnError();

    return {
      success: true,
      data: null,
      status: 200,
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
