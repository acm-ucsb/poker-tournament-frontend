export type UserType = "human" | "bot";
export type TableStatus = "not_started" | "active" | "waiting" | "inactive";
export type TournamentStatus = "not_started" | "active" | "completed";

export type User = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  is_admin: boolean;
  type: UserType;
  team_id: string | null;
};

export type Team = {
  id: string;
  created_at: string;
  name: string;
  has_submitted_code: boolean;
  num_chips: number;
  table_id: string | null;
  owner_id: string;
  is_disqualified: boolean;
  type: UserType;
};

export type Table = {
  id: string;
  created_at: string;
  status: TableStatus;
  name: string;
  game_state: PokerGameState; // Will be PokerGameState but stored as JSON in DB
  last_change: any; // type??
};

export type Tournament = {
  id: string;
  created_at: string;
  name: string;
  status: TournamentStatus;
  teams_deadline: string;
  submissions_deadline: string;
};

// Poker-specific types
export type CardSuit = "hearts" | "diamonds" | "clubs" | "spades";
export type CardRank =
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K"
  | "A";

export type PlayingCard = {
  suit: CardSuit;
  rank: CardRank;
};

export type PlayerAction =
  | "fold"
  | "check"
  | "call"
  | "bet"
  | "raise"
  | "all-in";

export type PlayerStatus = "active" | "folded" | "all-in" | "waiting";
export type GamePhase = "preflop" | "flop" | "turn" | "river" | "showdown";

// TODO: fix the types below
export type PokerPlayer = {
  id: string;
  teamId: string;
  teamName: string;
  position: number; // 0-8 for up to 9 players
  chips: number;
  currentBet: number;
  cards: PlayingCard[] | null; // null for face-down cards
  status: PlayerStatus;
  lastAction?: PlayerAction;
  lastActionAmount?: number;
  isDealer: boolean;
  isSmallBlind: boolean;
  isBigBlind: boolean;
  isCurrentPlayer: boolean;
};

export type PokerGameState = {
  tableId: string;
  phase: GamePhase;
  pot: number;
  communityCards: PlayingCard[];
  players: PokerPlayer[];
  currentBet: number;
  smallBlind: number;
  bigBlind: number;
  handNumber: number;
};
