"use server";

import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";
import { ServerActionError, ServerActionResponse } from "../types";
import {
  BACKEND_ENGINE_BASE_URL,
  UCSB_ACTIVE_POKER_TOURNEY_ID,
} from "@/lib/constants";
import axios from "axios";

export async function increaseBlinds(): Promise<ServerActionResponse<null>> {
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
        message: "You must be logged in to increase blinds on game tables.",
        code: "UNAUTHORIZED",
        status: 401,
      });
    }

    if (!user.email?.includes("@ucsb.edu")) {
      throw new ServerActionError({
        message: "You must use a UCSB email to increase blinds on game tables.",
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
        message: "You must be an admin to increase blinds on game tables.",
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
    if (tournament.status === "not_started") {
      throw new ServerActionError({
        message: "Tournament has not started yet, blinds cannot be increased.",
        code: "BAD_REQUEST",
        status: 400,
      });
    }

    try {
      await axios.post(
        `${BACKEND_ENGINE_BASE_URL}/admin/increase_blind?tournament_id=${UCSB_ACTIVE_POKER_TOURNEY_ID}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );
    } catch (error) {
      console.error(error);
      return {
        success: false,
        data: null,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to increase blinds.",
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
