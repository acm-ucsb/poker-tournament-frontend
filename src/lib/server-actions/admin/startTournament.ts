"use server";

import { createSupabaseServerClient } from "@/lib/supabase/supabase-server";
import { ServerActionError, ServerActionResponse } from "../types";
import {
  TABLE_SEATS_MIN_START,
  UCSB_ACTIVE_POKER_TOURNEY_ID,
} from "@/lib/constants";
import {
  uniqueNamesGenerator,
  Config,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";
import { calculateOptimalTableAssignment } from "@/lib/utils";

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

    // Fetch the number of valid teams (teams with submitted code)
    const {
      data: teams,
      count: totalTeamsCount,
      error: teamsError,
    } = await supabase
      .from("teams")
      .select("id", { count: "exact" })
      // .eq("tournament_id", UCSB_POKER_TOURNEY_ID) - removed for now since our tournament is hardcoded
      .eq("has_submitted_code", true)
      .eq("is_disqualified", false);

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

    // Calculate optimal table distribution
    const { numTables, playersPerTable } =
      calculateOptimalTableAssignment(totalTeamsCount);

    // Generate table names
    const tableNames: string[] = [];
    for (let i = 0; i < numTables; i++) {
      const randomName: string = uniqueNamesGenerator(config);
      tableNames.push(randomName);
    }

    // Insert tables into the database
    const { data: insertedTables } = await supabase
      .from("tables")
      .insert(
        tableNames.map((name: string) => ({
          name,
          tournament_id: UCSB_ACTIVE_POKER_TOURNEY_ID,
        }))
      )
      .select("id, name")
      .throwOnError();

    // Create a mapping from table name to table id
    const tableNameToId = new Map(
      insertedTables!.map((table) => [table.name, table.id])
    );

    const randomizedTeams = teams!.sort(() => Math.random() - 0.5); // Shuffle teams

    // Assign teams to tables using the optimized assignment
    const teamUpdates = [];
    let teamIndex = 0;

    for (let idx = 0; idx < playersPerTable.length; idx++) {
      const tableName = tableNames[idx];
      const tableId = tableNameToId.get(tableName);
      const teamsForThisTable = playersPerTable[idx];

      for (let i = 0; i < teamsForThisTable; i++) {
        if (teamIndex < randomizedTeams.length) {
          teamUpdates.push({
            id: randomizedTeams[teamIndex].id,
            table_id: tableId,
          });
          teamIndex++;
        }
      }
    }

    // Batch update all team assignments
    if (teamUpdates.length > 0) {
      for (const update of teamUpdates) {
        await supabase
          .from("teams")
          .update({ table_id: update.table_id })
          .eq("id", update.id)
          .throwOnError();
      }
    }

    // Update tournament status to 'active'
    await supabase
      .from("tournaments")
      .update({ status: "active" })
      .eq("id", UCSB_ACTIVE_POKER_TOURNEY_ID)
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
