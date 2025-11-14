import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
// import { TABLE_SEATS_MAX_COUNT, TABLE_SEATS_MIN_COUNT } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLanguageFromExtension({
  extension,
}: {
  extension: string;
}): string {
  switch (extension.toLowerCase()) {
    case "py":
      return "python";
    case "cpp":
      return "cpp";
    default:
      return "plaintext";
  }
}

/**
 * Calculates optimal table assignments using standard poker tournament balancing
 * Prioritizes fuller tables with minimal variance (standard tournament practice)
 * @param teamCount - Number of teams to assign to tables
 * @returns Object containing number of tables and playersPerTable array
 */
// export function calculateOptimalTableAssignment(teamCount: number): {
//   numTables: number;
//   playersPerTable: number[];
// } {
//   if (teamCount < TABLE_SEATS_MIN_COUNT) {
//     throw new Error(
//       `Not enough teams for a tournament. Minimum required: ${TABLE_SEATS_MIN_COUNT}, got: ${teamCount}`
//     );
//   }

//   // Strategy: Start with fewest possible tables and work up
//   // Prefer solutions with fewer, fuller tables while maintaining max difference of 1

//   let bestNumTables = 1;
//   let bestScore = Infinity;
//   let bestAssignment: number[] = [];

//   const maxPossibleTables = Math.floor(teamCount / TABLE_SEATS_MIN_COUNT);
//   const minPossibleTables = Math.ceil(teamCount / TABLE_SEATS_MAX_COUNT);

//   for (
//     let numTables = minPossibleTables;
//     numTables <= maxPossibleTables;
//     numTables++
//   ) {
//     const basePlayersPerTable = Math.floor(teamCount / numTables);
//     const extraPlayers = teamCount % numTables;

//     // Create assignment: some tables get basePlayersPerTable + 1, others get basePlayersPerTable
//     const assignment: number[] = [];

//     // First 'extraPlayers' tables get one extra player
//     for (let i = 0; i < extraPlayers; i++) {
//       assignment.push(basePlayersPerTable + 1);
//     }

//     // Remaining tables get base number
//     for (let i = extraPlayers; i < numTables; i++) {
//       assignment.push(basePlayersPerTable);
//     }

//     // Check if all table sizes are within valid range
//     const allValid = assignment.every(
//       (size) => size >= TABLE_SEATS_MIN_COUNT && size <= TABLE_SEATS_MAX_COUNT
//     );

//     if (!allValid) continue;

//     // Calculate score favoring fewer, fuller tables
//     const maxDiff = Math.max(...assignment) - Math.min(...assignment);

//     // Skip if difference is more than 1 (not balanced)
//     if (maxDiff > 1) continue;

//     // Score calculation: lower is better
//     // Primary factor: minimize number of tables (prefer fuller tables)
//     // Secondary factor: prefer higher average table size
//     const avgTableSize = teamCount / numTables;
//     const score = numTables - (avgTableSize / TABLE_SEATS_MAX_COUNT) * 0.5;

//     // Prefer solution with lowest score (fewest tables with decent size)
//     if (score < bestScore) {
//       bestScore = score;
//       bestNumTables = numTables;
//       bestAssignment = assignment;
//     }
//   }

//   if (bestAssignment.length === 0) {
//     // Fallback - this shouldn't happen with valid input
//     return { numTables: 1, playersPerTable: [teamCount] };
//   }

//   return { numTables: bestNumTables, playersPerTable: bestAssignment };
// }
