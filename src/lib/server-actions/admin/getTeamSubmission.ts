"use server";

import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";
import { ServerActionError, ServerActionResponse } from "../types";
import { BACKEND_ENGINE_BASE_URL } from "@/lib/constants";
import axios from "axios";
import { getLanguageFromExtension } from "@/lib/utils";

type Params = {
  teamId: string;
};

type SubmissionData = {
  team: Team;
  code: string;
  language: string;
};

export async function getTeamSubmission(
  params: Params
): Promise<ServerActionResponse<SubmissionData>> {
  const { teamId } = params;

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
        message: "You must be logged in to fetch submissions.",
        code: "UNAUTHORIZED",
        status: 401,
      });
    }

    if (!user.email?.includes("@ucsb.edu")) {
      throw new ServerActionError({
        message: "You must use a UCSB email to fetch submissions.",
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
        message: "You must be an admin to fetch team submissions.",
        code: "FORBIDDEN",
        status: 403,
      });
    }

    const res = await axios.get(
      `${BACKEND_ENGINE_BASE_URL}/admin/submission?team_id=${teamId}`,
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        validateStatus: function (status) {
          return true; // Don't throw errors for any status code, just handle them manually
        },
      }
    );

    if (
      res.status !== 200 ||
      !res.data ||
      !res.data.content ||
      !res.data.filename
    ) {
      throw new ServerActionError({
        message: "Failed to fetch submission.",
        code: "INTERNAL_SERVER_ERROR",
        status: res.status,
      });
    }

    const code = res.data.content;
    const language = getLanguageFromExtension({
      extension: res.data.filename.split(".").pop() || "",
    });

    // fetch team info
    const { data: team } = await supabase
      .from("teams")
      .select("*")
      .eq("id", teamId)
      .single();
    if (!team) {
      throw new ServerActionError({
        message: "Team not found.",
        code: "NOT_FOUND",
        status: 404,
      });
    }

    return {
      success: true,
      data: {
        team,
        code,
        language,
      },
      status: 200,
      error: null,
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
