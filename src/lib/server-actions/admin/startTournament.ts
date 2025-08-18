"use server";

import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";
import { ServerActionError, ServerActionResponse } from "../types";
import { UCSB_POKER_TOURNEY_ID } from "@/lib/constants";

export async function startTournament(): Promise<ServerActionResponse<null>> {
  /**
   * This method starts the tournament by doing the following:
   * 1. Security/Validation Checks
   * 2. Fetch the number of valid teams (teams with submitted code)
   * 3. Create the necessary tables based on the number of players with submitted code. (use the random name generator for table names)
   * 4. Begin play by setting the tournament status to 'active'.
   * 5. Send a request to the fastapi backend so it can assign players their seats
   */

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new ServerActionError({
        message: "You must be logged in to start a tournament.",
        code: "UNAUTHORIZED",
        status: 401,
      });
    }

    if (!user.email?.includes("@ucsb.edu")) {
      throw new ServerActionError({
        message: "You must use a UCSB email to start a tournament.",
        code: "FORBIDDEN",
        status: 403,
      });
    }

    // Security checks
    // check if tournament exists
    const { data: tournament } = await supabase
      .from("tournaments")
      .select("*")
      .eq("id", UCSB_POKER_TOURNEY_ID) // hardcoded for now
      .single();

    if (!tournament) {
      throw new ServerActionError({
        message: "Tournament not found",
        code: "BAD_REQUEST",
        status: 400,
      });
    }

    // check if user is admin
    const { data: userRole } = await supabase
      .from("users")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!userRole?.is_admin) {
      throw new ServerActionError({
        message: "You must be an admin to start a tournament.",
        code: "FORBIDDEN",
        status: 403,
      });
    }

    // check if tournament is already active
    if (tournament.status === "active") {
      throw new ServerActionError({
        message: "Tournament is already active",
        code: "BAD_REQUEST",
        status: 400,
      });
    }

    // TODO: implement main logic

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
