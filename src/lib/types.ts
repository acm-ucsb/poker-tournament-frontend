type UserType = "user" | "bot";
type TableStatus = "not_started" | "active" | "waiting" | "inactive";

type User = {
  id: string;
  created_at: string;
  name: string;
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
};

type Table = {
  id: string;
  created_at: string;
  status: TableStatus;
};
