"use server";

import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";
import { ServerActionError, ServerActionResponse } from "../types";
import {
  BACKEND_ENGINE_BASE_URL,
  UCSB_ACTIVE_POKER_TOURNEY_ID,
} from "@/lib/constants";
import axios from "axios";

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
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!user || !session) {
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

    // Security checks
    // check if tournament exists
    const { data: tournament } = await supabase
      .from("tournaments")
      .select("*")
      .eq("id", UCSB_ACTIVE_POKER_TOURNEY_ID) // hardcoded for now
      .single();

    if (!tournament) {
      throw new ServerActionError({
        message: "Tournament not found",
        code: "BAD_REQUEST",
        status: 400,
      });
    }

    // check if tournament is already active
    if (tournament.status !== "not_started") {
      throw new ServerActionError({
        message: "Tournament is already active or has ended.",
        code: "BAD_REQUEST",
        status: 400,
      });
    }

    try {
      // TODO: Send request to FastAPI backend to create tables and assign seats
      const res = await axios.post(
        `${BACKEND_ENGINE_BASE_URL}/admin/tables/create`,
        {},
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      console.log(res);

      // Update tournament status to 'active'
      await supabase
        .from("tournaments")
        .update({ status: "active" })
        .eq("id", UCSB_ACTIVE_POKER_TOURNEY_ID)
        .throwOnError();
    } catch (error) {
      console.error(error);
      return {
        success: false,
        data: null,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to start tournament.",
        },
      };
    }

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
