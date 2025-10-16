"use server";

import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";
import { ServerActionError, ServerActionResponse } from "../types";
import {
  BACKEND_ENGINE_BASE_URL,
  DISQUALIFICATION_MESSAGE,
  UCSB_ACTIVE_POKER_TOURNEY_ID,
} from "@/lib/constants";
import axios from "axios";

type Params = {
  file: File;
};

export async function createSubmission(
  params: Params
): Promise<ServerActionResponse<null>> {
  const { file } = params;

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
        message: "You must be logged in to submit code.",
        code: "UNAUTHORIZED",
        status: 401,
      });
    }

    if (!user.email?.includes("@ucsb.edu")) {
      throw new ServerActionError({
        message: "You must use a UCSB email to submit code.",
        code: "FORBIDDEN",
        status: 403,
      });
    }

    // check if deadline has passed
    const { data: tournament } = await supabase
      .from("tournaments")
      .select("submissions_deadline, status")
      .eq("id", UCSB_ACTIVE_POKER_TOURNEY_ID)
      .single()
      .throwOnError();

    if (tournament && tournament.submissions_deadline) {
      const deadline = new Date(tournament.submissions_deadline);
      const now = new Date();
      if (now > deadline || tournament.status !== "not_started") {
        throw new ServerActionError({
          message: "The deadline to submit code has passed.",
          code: "FORBIDDEN",
          status: 403,
        });
      }
    }

    // check if user is in a team
    const { data: userTeam } = await supabase
      .from("users")
      .select("team_id")
      .eq("id", user.id)
      .single()
      .throwOnError();

    if (!userTeam?.team_id) {
      throw new ServerActionError({
        message: "You must be in a team to submit code.",
        code: "FORBIDDEN",
        status: 403,
      });
    }

    // check if team is disqualified
    const { data: team } = await supabase
      .from("teams")
      .select("is_disqualified")
      .eq("id", userTeam.team_id)
      .single()
      .throwOnError();

    if (team?.is_disqualified) {
      throw new ServerActionError({
        message: DISQUALIFICATION_MESSAGE,
        code: "FORBIDDEN",
        status: 403,
      });
    }

    const newFormData = new FormData();
    newFormData.append("file", file);

    const res = await axios.post(
      `${BACKEND_ENGINE_BASE_URL}/submission`,
      newFormData,
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        validateStatus: function (status) {
          return true; // Don't throw errors for any status code, just handle them manually
        },
      }
    );

    if (res.data?.file_saved) {
      return {
        success: true,
        data: null,
        status: 200,
        error: null,
      };
    }

    return {
      success: false,
      data: null,
      status: 400,
      error: {
        code: "FILE_NOT_SAVED",
        message: "There was an error submitting your code.",
        details: "Please try signing in again or try later.",
      },
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
