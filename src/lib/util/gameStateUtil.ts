import { PokerGameState } from "../types";

export type HandWinner = {
  playerIndex: number;
  playerName: string;
  chipsWon: number;
};

export type EliminatedPlayer = {
  playerIndex: number;
  playerName: string;
};

export type PlayerChange = {
  playerId: string;
  playerName: string;
  changeType: "joined" | "left";
};

/**
 * Find the winner(s) of a hand by comparing old and new game states
 * @param oldState - Previous game state
 * @param newState - Current game state
 * @returns Array of winners with their chip gains
 */
export function findHandWinners(
  oldState: PokerGameState,
  newState: PokerGameState
): HandWinner[] {
  const winners: HandWinner[] = [];

  // Additional validation: check if pot was distributed
  // The total pot value should have decreased or reset
  const oldPotTotal = oldState.pots.reduce((sum, pot) => sum + pot.value, 0);
  const newPotTotal = newState.pots.reduce((sum, pot) => sum + pot.value, 0);

  // Only proceed if the pot was actually distributed
  if (oldPotTotal <= newPotTotal) {
    return [];
  }

  // Calculate the total blinds posted in the new hand
  // Small blind and big blind are posted at specific positions
  const smallBlindIndex = newState.index_of_small_blind;
  const bigBlindIndex = (smallBlindIndex + 1) % newState.players.length;

  // Compare chip stacks to find winners, accounting for blinds in the new state
  for (let i = 0; i < oldState.players.length; i++) {
    const oldChips = oldState.held_money[i];
    let newChips = newState.held_money[i];

    // Add back the blinds that were deducted in the new state
    if (i === smallBlindIndex) {
      newChips += newState.small_blind;
    } else if (i === bigBlindIndex) {
      newChips += newState.big_blind;
    }

    const chipsGained = newChips - oldChips;

    // A player is a winner if they gained chips (accounting for blinds)
    if (chipsGained > 0) {
      winners.push({
        playerIndex: i,
        playerName: newState.players[i].name,
        chipsWon: chipsGained,
      });
    }
  }

  return winners;
}

/**
 * Find players who were eliminated by comparing old and new game states
 * A player is eliminated when they have 0 chips and are not eligible for any pots
 * @param oldState - Previous game state
 * @param newState - Current game state
 * @returns Array of eliminated players
 */
export function findEliminatedPlayers(
  oldState: PokerGameState,
  newState: PokerGameState
): EliminatedPlayer[] {
  const eliminated: EliminatedPlayer[] = [];

  // Check if any players from the old state are missing in the new state
  for (let i = 0; i < oldState.players.length; i++) {
    const playerId = oldState.players[i].id;
    const playerName = oldState.players[i].name;

    // Check if this player still exists in the new state
    const stillInGame = newState.players.some((p) => p.id === playerId);

    // Player is eliminated if they were in the old state but not in the new state
    if (!stillInGame) {
      eliminated.push({
        playerIndex: i,
        playerName: playerName,
      });
    }
  }

  return eliminated;
}

/**
 * Detect when players join or leave the table by comparing old and new game states
 * Note: This excludes eliminated players from "left" events
 * @param oldState - Previous game state
 * @param newState - Current game state
 * @param eliminatedPlayers - Array of eliminated players to exclude from left events
 * @returns Array of player changes (joins and leaves)
 */
export function findPlayerChanges(
  oldState: PokerGameState,
  newState: PokerGameState,
  eliminatedPlayers: EliminatedPlayer[]
): PlayerChange[] {
  const changes: PlayerChange[] = [];

  // Create set of eliminated player IDs to exclude from "left" events
  const eliminatedPlayerIds = new Set(
    eliminatedPlayers.map((p) => oldState.players[p.playerIndex].id)
  );

  // Create sets of player IDs for easy lookup
  const oldPlayerIds = new Set(oldState.players.map((p) => p.id));
  const newPlayerIds = new Set(newState.players.map((p) => p.id));

  // Find players who left (in old state but not in new state)
  // Exclude eliminated players since they have their own notification
  for (const player of oldState.players) {
    if (!newPlayerIds.has(player.id) && !eliminatedPlayerIds.has(player.id)) {
      changes.push({
        playerId: player.id,
        playerName: player.name,
        changeType: "left",
      });
    }
  }

  // Find players who joined (in new state but not in old state)
  for (const player of newState.players) {
    if (!oldPlayerIds.has(player.id)) {
      changes.push({
        playerId: player.id,
        playerName: player.name,
        changeType: "joined",
      });
    }
  }

  return changes;
}
