"use server";

import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";
import { ServerActionError, ServerActionResponse } from "../types";
import { Team } from "@/lib/types";

type Params = {
  teamIds: string[];
};

export async function getTeams(
  params: Params
): Promise<ServerActionResponse<Team[]>> {
  const { teamIds } = params;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!user || !session) {
      throw new ServerActionError({
        message: "You must be logged in to get a team.",
        code: "UNAUTHORIZED",
        status: 401,
      });
    }

    if (!user.email?.includes("@ucsb.edu")) {
      throw new ServerActionError({
        message: "You must use a UCSB email to get a team.",
        code: "FORBIDDEN",
        status: 403,
      });
    }

    if (teamIds.length === 0) {
      return {
        success: true,
        data: [],
        status: 200,
        error: null,
      };
    }

    const orderMap = teamIds.map((id, index) => ({ id, order: index }));

    // check if team with team id exists
    const { data: teams } = await supabase
      .from("teams")
      .select("*")
      .in("id", teamIds)
      .throwOnError();

    if (!teams || teams.length === 0) {
      throw new ServerActionError({
        message: "Teams not found",
        code: "BAD_REQUEST",
        status: 400,
      });
    }

    teams.sort((a, b) => {
      const aOrder = orderMap.find((item) => item.id === a.id)?.order || 0;
      const bOrder = orderMap.find((item) => item.id === b.id)?.order || 0;
      return aOrder - bOrder;
    });

    return {
      success: true,
      data: teams,
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
