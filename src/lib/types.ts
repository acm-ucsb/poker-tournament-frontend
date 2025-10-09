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
  game_state: PokerGameStateDB; // Will be PokerGameState but stored as JSON in DB
  last_change: any; // type??
};

export type Tournament = {
  id: string;
  created_at: string;
  name: string;
  status: TournamentStatus;
  teams_deadline: string;
  submissions_deadline: string;
  starting_chips: number;
  start_time: string | null;
  end_time: string | null;
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
  | "T"
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

export type Pot = {
  value: number;
  players: string[]; // team IDs eligible for this pot
};

export type PokerGameStateDB = {
  index_to_action: number; // index of player whose turn it is
  index_of_small_blind: number; // index of small blind player
  players: string[]; // list of teams - DB returns list of IDs, but we need full team objects here, must be joined
  players_cards: [string, string][]; // list of player hands in seating order
  held_money: number[]; // list of current stack sizes in seating order
  bet_money: number[]; // list of current bets in seating order
  community_cards: string[]; // 0 to 5 cards
  pots: Pot[]; // list of pots
  small_blind: number;
  big_blind: number;
};

export type PokerGameState = Omit<
  PokerGameStateDB,
  "players_cards" | "community_cards" | "players" | "phase"
> & {
  players_cards: [PlayingCard, PlayingCard][]; // list of player hands in seating order
  community_cards: PlayingCard[]; // 0 to 5 cards
  players: Team[]; // list of teams - DB returns list of IDs, but we need full team objects here, must be joined
  phase: GamePhase; // current phase of the hand - this is not in the DB, must be derived
};
