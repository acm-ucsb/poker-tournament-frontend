type UserType = "human" | "bot";
type TableStatus = "not_started" | "active" | "waiting" | "inactive";
type TournamentStatus = "not_started" | "active" | "completed";

type User = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  is_admin: boolean;
  type: UserType;
  team_id: string | null;
};

type Team = {
  id: string;
  created_at: string;
  name: string;
  has_submitted_code: boolean;
  num_chips: number;
  table_id: string | null;
  owner_id: string;
  is_disqualified: boolean;
};

type Table = {
  id: string;
  created_at: string;
  status: TableStatus;
  name: string;
};

type Tournament = {
  id: string;
  created_at: string;
  name: string;
  status: TournamentStatus;
  teams_deadline: string;
  submissions_deadline: string;
};
