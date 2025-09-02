"use server";

import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";
import { ServerActionError, ServerActionResponse } from "../types";

type Params = {
  teamId: string;
};

export async function toggleQualification(
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
    // check if team exists
    const { data: team } = await supabase
      .from("teams")
      .select("*")
      .eq("id", teamId)
      .single();
    if (!team) {
      throw new ServerActionError({
        message: "Team not found",
        code: "BAD_REQUEST",
        status: 400,
      });
    }

    // toggle qualification
    await supabase
      .from("teams")
      .update({ is_disqualified: !team.is_disqualified })
      .eq("id", teamId)
      .throwOnError();

    return {
      success: true,
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
