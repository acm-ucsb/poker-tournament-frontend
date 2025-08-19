"use server";

import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";
import { ServerActionError, ServerActionResponse } from "../types";
import {
  TABLE_SEATS_MAX_COUNT,
  TABLE_SEATS_MIN_START,
  UCSB_POKER_TOURNEY_ID,
} from "@/lib/constants";
import {
  uniqueNamesGenerator,
  Config,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

const config: Config = {
  dictionaries: [adjectives, colors, animals],
  length: 3,
  separator: " ",
  style: "capital",
};

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
    if (tournament.status !== "not_started") {
      throw new ServerActionError({
        message: "Tournament is already active or has ended.",
        code: "BAD_REQUEST",
        status: 400,
      });
    }

    // Fetch the number of valid teams (teams with submitted code)
    const { count: totalTeamsCount, error: teamsError } = await supabase
      .from("teams")
      .select("*", { count: "exact", head: true })
      // .eq("tournament_id", UCSB_POKER_TOURNEY_ID) - removed for now since our tournament is hardcoded
      .eq("has_submitted_code", true);

    if (teamsError) {
      throw new ServerActionError({
        message: "Failed to fetch teams",
        code: "INTERNAL_SERVER_ERROR",
        status: 500,
      });
    }

    if (!totalTeamsCount || totalTeamsCount < TABLE_SEATS_MIN_START) {
      throw new ServerActionError({
        message: "Not enough valid teams to start the tournament.",
        code: "BAD_REQUEST",
        status: 400,
      });
    }

    const numTablesNeeded = Math.ceil(totalTeamsCount / TABLE_SEATS_MAX_COUNT);
    const tables: string[] = [];

    // generate random table names
    for (let i = 0; i < numTablesNeeded; i++) {
      const randomName: string = uniqueNamesGenerator(config);
      tables.push(randomName);
    }

    // Insert tables into the database
    await supabase
      .from("tables")
      .insert(
        tables.map((name) => ({
          name,
        }))
      )
      .throwOnError();

    // Update tournament status to 'active'
    await supabase
      .from("tournaments")
      .update({ status: "active" })
      .eq("id", UCSB_POKER_TOURNEY_ID)
      .throwOnError();

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
