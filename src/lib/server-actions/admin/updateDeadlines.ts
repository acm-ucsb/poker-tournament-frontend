"use server";

import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";
import { ServerActionError, ServerActionResponse } from "../types";
import { UCSB_ACTIVE_POKER_TOURNEY_ID } from "@/lib/constants";

type Params = {
  teamsDeadline?: Date | null;
  submissionsDeadline?: Date | null;
};

export async function updateDeadlines(
  params: Params
): Promise<ServerActionResponse<null>> {
  const { teamsDeadline, submissionsDeadline } = params;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new ServerActionError({
        message: "You must be logged in to update tournament deadlines.",
        code: "UNAUTHORIZED",
        status: 401,
      });
    }

    if (!user.email?.includes("@ucsb.edu")) {
      throw new ServerActionError({
        message: "You must use a UCSB email to update tournament deadlines.",
        code: "FORBIDDEN",
        status: 403,
      });
    }

    // check if user.is_admin is true
    const { data: userRecord } = await supabase
      .from("users")
      .select("is_admin")
      .eq("id", user.id)
      .single()
      .throwOnError();

    if (!userRecord?.is_admin) {
      throw new ServerActionError({
        message: "You must be an admin to update tournament deadlines.",
        code: "FORBIDDEN",
        status: 403,
      });
    }

    // check if tournament exists
    const { data: tournament } = await supabase
      .from("tournaments")
      .select("*")
      .eq("id", UCSB_ACTIVE_POKER_TOURNEY_ID) // Assuming there's only one tournament for simplicity
      .single()
      .throwOnError();

    if (!tournament) {
      throw new ServerActionError({
        message: "Tournament not found.",
        code: "NOT_FOUND",
        status: 404,
      });
    }

    // Update deadlines in the tournament
    await supabase
      .from("tournaments")
      .update({
        teams_deadline: teamsDeadline,
        submissions_deadline: submissionsDeadline,
      })
      .eq("id", UCSB_ACTIVE_POKER_TOURNEY_ID)
      .throwOnError();

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
