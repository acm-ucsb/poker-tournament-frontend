import { getTeams } from "../server-actions";
import {
  CardRank,
  CardSuit,
  GamePhase,
  PlayingCard,
  PokerGameState,
  PokerGameStateDB,
} from "../types";

export async function parseGameState(
  game_state: PokerGameStateDB
): Promise<PokerGameState> {
  // The goal of this helper function is to take the raw game state from the DB and populate specific fields
  // that are stored as IDs or minimal data in the DB, but need to be full objects in the app.
  // Specifically, we need to populate:
  // - players: from list of team IDs to full Team objects
  // - players_cards: from list of card representations to full PlayingCard objects
  // - communityCards: from list of card representations to full PlayingCard objects
  // - phase: ensure it's a valid GamePhase enum value

  // Populate players
  const teamsData = await getTeams({
    teamIds: game_state.players,
  });

  if (!teamsData.success || !teamsData.data) {
    throw new Error("Failed to fetch team data");
  }

  const playerCards = [] as [PlayingCard, PlayingCard][];
  for (const cardPair of game_state.players_cards) {
    // the first letter of each card is the suit, the rest is the rank. convert to PlayingCard object
    const parsedPair: [PlayingCard, PlayingCard] = cardPair.map((cardStr) => {
      return parseCard(cardStr);
    }) as [PlayingCard, PlayingCard];

    playerCards.push(parsedPair);
  }

  const communityCards = game_state.community_cards.map((cardStr) => {
    return parseCard(cardStr);
  });

  const phase: GamePhase =
    communityCards.length === 0
      ? "preflop"
      : communityCards.length === 3
        ? "flop"
        : communityCards.length === 4
          ? "turn"
          : communityCards.length === 5
            ? "river"
            : "showdown";

  return {
    ...game_state,
    players: teamsData.data,
    players_cards: playerCards,
    community_cards: communityCards,
    phase,
  };
}

function parseCard(cardStr: string): PlayingCard {
  const suitStr = cardStr.charAt(1) as string;

  const suitMap: Record<string, CardSuit> = {
    h: "hearts",
    d: "diamonds",
    c: "clubs",
    s: "spades",
  };

  const suit = suitMap[suitStr];
  const rank = cardStr.slice(0, 1).toUpperCase() as CardRank;

  return { suit, rank };
}
