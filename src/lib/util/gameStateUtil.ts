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
