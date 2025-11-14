// Poker hand evaluation utilities

type Card = string; // 2-character string: rank + suit (e.g., 'as', 'kh', '2c')

type HandRank =
  | "high-card"
  | "pair"
  | "two-pair"
  | "three-of-a-kind"
  | "straight"
  | "flush"
  | "full-house"
  | "four-of-a-kind"
  | "straight-flush";

interface HandEvaluation {
  rank: HandRank;
  values: number[]; // Primary values (e.g., pair value, kickers)
  cards: Card[]; // The 5 cards making up the best hand
}

const RANK_VALUES: { [key: string]: number } = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  t: 10,
  j: 11,
  q: 12,
  k: 13,
  a: 14,
};

const RANK_NAMES: { [key: number]: string } = {
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
  7: "seven",
  8: "eight",
  9: "nine",
  10: "ten",
  11: "jack",
  12: "queen",
  13: "king",
  14: "ace",
};

const RANK_NAMES_PLURAL: { [key: number]: string } = {
  2: "twos",
  3: "threes",
  4: "fours",
  5: "fives",
  6: "sixes",
  7: "sevens",
  8: "eights",
  9: "nines",
  10: "tens",
  11: "jacks",
  12: "queens",
  13: "kings",
  14: "aces",
};

function parseCard(card: Card): { rank: number; suit: string } {
  return {
    rank: RANK_VALUES[card[0]],
    suit: card[1],
  };
}

function isFlush(cards: Card[]): boolean {
  const suit = cards[0][1];
  return cards.every((card) => card[1] === suit);
}

function isStraight(ranks: number[]): boolean {
  const sorted = [...ranks].sort((a, b) => b - a);

  // Check for regular straight
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i] - sorted[i + 1] !== 1) {
      // Check for A-2-3-4-5 (wheel)
      if (
        sorted[0] === 14 &&
        sorted[1] === 5 &&
        sorted[2] === 4 &&
        sorted[3] === 3 &&
        sorted[4] === 2
      ) {
        return true;
      }
      return false;
    }
  }
  return true;
}

function getStraightHighCard(ranks: number[]): number {
  const sorted = [...ranks].sort((a, b) => b - a);
  // Check for A-2-3-4-5 (wheel) - 5 is the high card
  if (
    sorted[0] === 14 &&
    sorted[1] === 5 &&
    sorted[2] === 4 &&
    sorted[3] === 3 &&
    sorted[4] === 2
  ) {
    return 5;
  }
  return sorted[0];
}

function evaluateHand(cards: Card[]): HandEvaluation {
  if (cards.length !== 5) {
    throw new Error("Hand must contain exactly 5 cards");
  }

  const parsed = cards.map(parseCard);
  const ranks = parsed.map((c) => c.rank);
  const sortedRanks = [...ranks].sort((a, b) => b - a);

  // Count rank occurrences
  const rankCounts: { [key: number]: number } = {};
  ranks.forEach((rank) => {
    rankCounts[rank] = (rankCounts[rank] || 0) + 1;
  });

  const counts = Object.entries(rankCounts)
    .map(([rank, count]) => ({ rank: parseInt(rank), count }))
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return b.rank - a.rank;
    });

  const isFlushHand = isFlush(cards);
  const isStraightHand = isStraight(ranks);

  // Straight flush
  if (isFlushHand && isStraightHand) {
    return {
      rank: "straight-flush",
      values: [getStraightHighCard(ranks)],
      cards,
    };
  }

  // Four of a kind
  if (counts[0].count === 4) {
    return {
      rank: "four-of-a-kind",
      values: [counts[0].rank, counts[1].rank],
      cards,
    };
  }

  // Full house
  if (counts[0].count === 3 && counts[1].count === 2) {
    return {
      rank: "full-house",
      values: [counts[0].rank, counts[1].rank],
      cards,
    };
  }

  // Flush
  if (isFlushHand) {
    return {
      rank: "flush",
      values: sortedRanks,
      cards,
    };
  }

  // Straight
  if (isStraightHand) {
    return {
      rank: "straight",
      values: [getStraightHighCard(ranks)],
      cards,
    };
  }

  // Three of a kind
  if (counts[0].count === 3) {
    return {
      rank: "three-of-a-kind",
      values: [counts[0].rank, ...counts.slice(1).map((c) => c.rank)],
      cards,
    };
  }

  // Two pair
  if (counts[0].count === 2 && counts[1].count === 2) {
    return {
      rank: "two-pair",
      values: [counts[0].rank, counts[1].rank, counts[2].rank],
      cards,
    };
  }

  // Pair
  if (counts[0].count === 2) {
    return {
      rank: "pair",
      values: [counts[0].rank, ...counts.slice(1).map((c) => c.rank)],
      cards,
    };
  }

  // High card
  return {
    rank: "high-card",
    values: sortedRanks,
    cards,
  };
}

function compareHands(hand1: HandEvaluation, hand2: HandEvaluation): number {
  const rankOrder: HandRank[] = [
    "high-card",
    "pair",
    "two-pair",
    "three-of-a-kind",
    "straight",
    "flush",
    "full-house",
    "four-of-a-kind",
    "straight-flush",
  ];

  const rank1 = rankOrder.indexOf(hand1.rank);
  const rank2 = rankOrder.indexOf(hand2.rank);

  if (rank1 !== rank2) {
    return rank1 - rank2;
  }

  // Compare values
  for (let i = 0; i < Math.max(hand1.values.length, hand2.values.length); i++) {
    const val1 = hand1.values[i] || 0;
    const val2 = hand2.values[i] || 0;
    if (val1 !== val2) {
      return val1 - val2;
    }
  }

  return 0;
}

function* combinations<T>(array: T[], size: number): Generator<T[]> {
  if (size === 0) {
    yield [];
    return;
  }
  if (array.length === 0) return;

  const [first, ...rest] = array;

  // Include first element
  for (const combo of combinations(rest, size - 1)) {
    yield [first, ...combo];
  }

  // Exclude first element
  yield* combinations(rest, size);
}

function findBestHand(cards: Card[]): HandEvaluation {
  if (cards.length < 5) {
    throw new Error("Need at least 5 cards to evaluate a hand");
  }

  let bestHand: HandEvaluation | null = null;

  for (const combo of combinations(cards, 5)) {
    const evaluation = evaluateHand(combo);
    if (!bestHand || compareHands(evaluation, bestHand) > 0) {
      bestHand = evaluation;
    }
  }

  return bestHand!;
}

function describeHand(evaluation: HandEvaluation): string {
  switch (evaluation.rank) {
    case "straight-flush": {
      const highCard = evaluation.values[0];
      if (highCard === 14) {
        return "royal flush";
      }
      return `straight flush, ${RANK_NAME(highCard)} high`;
    }

    case "four-of-a-kind": {
      const quadValue = evaluation.values[0];
      const kicker = evaluation.values[1];
      return `four of a kind, ${RANK_NAMES_PLURAL[quadValue]}, ${RANK_NAME(kicker)} kicker`;
    }

    case "full-house": {
      const tripValue = evaluation.values[0];
      const pairValue = evaluation.values[1];
      return `full house, ${RANK_NAMES_PLURAL[tripValue]} over ${RANK_NAMES_PLURAL[pairValue]}`;
    }

    case "flush": {
      const highCard = evaluation.values[0];
      //   const kickers = evaluation.values.slice(1);
      //   if (kickers.length > 0) {
      //     const kickerStr = kickers.map((k) => RANK_NAME(k)).join(", ");
      //     return `flush, ${RANK_NAME(highCard)} high, ${kickerStr} kickers`;
      //   }
      return `flush, ${RANK_NAME(highCard)} high`;
    }

    case "straight": {
      const highCard = evaluation.values[0];
      return `straight, ${RANK_NAME(highCard)} high`;
    }

    case "three-of-a-kind": {
      const tripValue = evaluation.values[0];
      const kickers = evaluation.values.slice(1);
      if (kickers.length > 0) {
        const kickerStr = kickers.map((k) => RANK_NAME(k)).join(", ");
        return `three of a kind, ${RANK_NAMES_PLURAL[tripValue]}, and ${kickerStr} kickers`;
      }
      return `three of a kind, ${RANK_NAMES_PLURAL[tripValue]}`;
    }

    case "two-pair": {
      const highPair = evaluation.values[0];
      const lowPair = evaluation.values[1];
      const kicker = evaluation.values[2];
      return `two pair, ${RANK_NAMES_PLURAL[highPair]} and ${RANK_NAMES_PLURAL[lowPair]}, ${RANK_NAME(kicker)} kicker`;
    }

    case "pair": {
      const pairValue = evaluation.values[0];
      const kickers = evaluation.values.slice(1);
      if (kickers.length > 0) {
        const kickerStr = kickers.map((k) => RANK_NAME(k)).join(", ");
        return `pair of ${RANK_NAMES_PLURAL[pairValue]}, ${kickerStr} kickers`;
      }
      return `pair of ${RANK_NAMES_PLURAL[pairValue]}`;
    }

    case "high-card": {
      const highCard = evaluation.values[0];
      const kickers = evaluation.values.slice(1);
      if (kickers.length > 0) {
        const kickerStr = kickers.map((k) => RANK_NAME(k)).join(", ");
        return `${RANK_NAME(highCard)} high, ${kickerStr} kickers`;
      }
      return `${RANK_NAME(highCard)} high`;
    }

    default:
      return "unknown hand";
  }
}

function RANK_NAME(value: number): string {
  return RANK_NAMES[value] || "unknown";
}

/**
 * Calculate the best poker hand from player cards and community cards
 * @param playerCards - Array of 2-character card strings for the player (e.g., ['as', 'kh'])
 * @param communityCards - Array of 2-character card strings for community cards (e.g., ['ad', 'kc', '2s', '3h', '4d'])
 * @returns A descriptive string of the best hand (e.g., "pair of aces, king kicker")
 */
export function getBestHandDescription(
  playerCards: Card[],
  communityCards: Card[]
): string {
  if (playerCards.length !== 2) {
    throw new Error("Player must have exactly 2 cards");
  }
  if (communityCards.length < 3 || communityCards.length > 5) {
    throw new Error("Community cards must be between 3 and 5 cards");
  }

  const allCards = [...playerCards, ...communityCards];
  const bestHand = findBestHand(allCards);
  return describeHand(bestHand);
}

export interface PlayerHandResult {
  playerIndex: number;
  hand: HandEvaluation;
  description: string;
}

/**
 * Find the best hand(s) among multiple players
 * @param playerHands - Array of player hands, where each hand is a 2-card array (e.g., [['as', 'kh'], ['2c', '3d']])
 * @param communityCards - Array of 3-5 community cards (e.g., ['ad', 'kc', '2s', '3h', '4d'])
 * @returns Array of winning player indices (can be multiple in case of a tie) with their hand details
 */
export function findBestHandAmongPlayers(
  playerHands: Card[][],
  communityCards: Card[]
): PlayerHandResult[] {
  if (communityCards.length < 3 || communityCards.length > 5) {
    throw new Error("Community cards must be between 3 and 5 cards");
  }

  // Evaluate each player's best hand
  const evaluations: PlayerHandResult[] = playerHands.map(
    (playerCards, index) => {
      if (playerCards.length !== 2) {
        throw new Error(`Player ${index} must have exactly 2 cards`);
      }

      const allCards = [...playerCards, ...communityCards];
      const bestHand = findBestHand(allCards);

      return {
        playerIndex: index,
        hand: bestHand,
        description: describeHand(bestHand),
      };
    }
  );

  // Find the best hand(s)
  let winners: PlayerHandResult[] = [evaluations[0]];

  for (let i = 1; i < evaluations.length; i++) {
    const comparison = compareHands(evaluations[i].hand, winners[0].hand);

    if (comparison > 0) {
      // This hand is better, new winner(s)
      winners = [evaluations[i]];
    } else if (comparison === 0) {
      // Tie, add to winners
      winners.push(evaluations[i]);
    }
    // If comparison < 0, this hand is worse, skip
  }

  return winners;
}
