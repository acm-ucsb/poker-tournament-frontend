export const BACKEND_ENGINE_BASE_URL =
  "https://poker-backend.ddns.net" as const;

export const HEADER_HEIGHT_PX = 80 as const;
export const HEADER_AVATAR_SIZE_PX = 36 as const;

export const DEFAULT_SIGNIN_REDIRECT_URL = "/dashboard" as const;

export const TEAM_MAX_MEMBERS = 3 as const;
export const TEAM_NAME_MIN_LENGTH = 3 as const;
export const TEAM_NAME_MAX_LENGTH = 25 as const;

export const SUBMISSION_MAX_FILE_SIZE = 10485760 as const; // 10 MB (10 * 1024 * 1024 bytes)
// export const TABLE_SEATS_MAX_COUNT = 9;
// export const TABLE_SEATS_MIN_COUNT = 2;
// export const TABLE_SEATS_MIN_START = 5;

export const POLL_INTERVAL_MS = 5000 as const; // 10 seconds
// export const TABLE_SEATS_MIN_COUNT = 1; // allow 1 for testing purposes
// export const TABLE_SEATS_MIN_START = 1; // allow 1 for testing purposes

export const UCSB_BOT_POKER_TOURNEY_ID =
  "f6fd507b-42fb-4fba-a0d3-e9ded05aeca5" as const; // hard code for now, implement different tournaments later
export const UCSB_HUMAN_POKER_TOURNEY_ID =
  "0f31fbe5-e8d0-4e46-a564-430a919155e6" as const; // hard code for now, implement different tournaments later

export const UCSB_ACTIVE_POKER_TOURNEY_ID = UCSB_BOT_POKER_TOURNEY_ID; // CHANGE THIS TO UCSB_HUMAN_POKER_TOURNEY_ID when switching tournaments
// export const UCSB_ACTIVE_POKER_TOURNEY_ID = UCSB_HUMAN_POKER_TOURNEY_ID; // CHANGE THIS TO UCSB_HUMAN_POKER_TOURNEY_ID when switching tournaments

export const DISQUALIFICATION_MESSAGE =
  "Your team has been disqualified and cannot submit code. Please contact an admin for more information.";

export const HEX_OPACITY_POSTFIX = {
  100: "FF",
  99: "FC",
  98: "FA",
  97: "F7",
  96: "F5",
  95: "F2",
  94: "F0",
  93: "ED",
  92: "EB",
  91: "E8",
  90: "E6",
  89: "E3",
  88: "E0",
  87: "DE",
  86: "DB",
  85: "D9",
  84: "D6",
  83: "D4",
  82: "D1",
  81: "CF",
  80: "CC",
  79: "C9",
  78: "C7",
  77: "C4",
  76: "C2",
  75: "BF",
  74: "BD",
  73: "BA",
  72: "B8",
  71: "B5",
  70: "B3",
  69: "B0",
  68: "AD",
  67: "AB",
  66: "A8",
  65: "A6",
  64: "A3",
  63: "A1",
  62: "9E",
  61: "9C",
  60: "99",
  59: "96",
  58: "94",
  57: "91",
  56: "8F",
  55: "8C",
  54: "8A",
  53: "87",
  52: "85",
  51: "82",
  50: "80",
  49: "7D",
  48: "7A",
  47: "78",
  46: "75",
  45: "73",
  44: "70",
  43: "6E",
  42: "6B",
  41: "69",
  40: "66",
  39: "63",
  38: "61",
  37: "5E",
  36: "5C",
  35: "59",
  34: "57",
  33: "54",
  32: "52",
  31: "4F",
  30: "4D",
  29: "4A",
  28: "47",
  27: "45",
  26: "42",
  25: "40",
  24: "3D",
  23: "3B",
  22: "38",
  21: "36",
  20: "33",
  19: "30",
  18: "2E",
  17: "2B",
  16: "29",
  15: "26",
  14: "24",
  13: "21",
  12: "1F",
  11: "1C",
  10: "1A",
  9: "17",
  8: "14",
  7: "12",
  6: "0F",
  5: "0D",
  4: "0A",
  3: "08",
  2: "05",
  1: "03",
  0: "00",
} as const;
